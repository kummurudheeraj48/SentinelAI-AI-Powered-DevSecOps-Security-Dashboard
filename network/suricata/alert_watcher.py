"""
Watches Suricata's fast.log for new alerts and pushes them into
SentinelAI's /network/alerts endpoint in real time.
"""
import time
import re
import requests

API_BASE = "http://192.168.56.101:8000"
LOG_PATH = "/var/log/suricata/fast.log"
USERNAME = "admin"
PASSWORD = "TestPass123"

# Matches lines like:
# 08/09/2026-15:14:43.161353  [**] [1:1000001:1] ICMP Ping Detected [**] [Classification: Misc activity] [Priority: 3] {ICMP} 192.168.56.1:8 -> 192.168.56.101:0
LINE_PATTERN = re.compile(
    r"\[\*\*\].*?\]\s+(?P<message>.+?)\s+\[\*\*\].*?Priority:\s*(?P<priority>\d+)\].*?\{(?P<proto>\w+)\}\s+"
    r"(?P<src>[\d.]+):?\d*\s*->\s*(?P<dst>[\d.]+):?\d*"
)

# Suricata priority 1 = most severe, 3 = least severe. Map to our scale.
PRIORITY_MAP = {"1": "critical", "2": "high", "3": "medium"}


def get_token():
    resp = requests.post(f"{API_BASE}/login", data={"username": USERNAME, "password": PASSWORD})
    return resp.json().get("access_token")


def send_alert(token, source_ip, dest_ip, message, severity, raw_line):
    resp = requests.post(
        f"{API_BASE}/network/alerts",
        params={
            "source_ip": source_ip,
            "dest_ip": dest_ip,
            "alert_message": message,
            "severity": severity,
            "raw_log": raw_line,
        },
        headers={"Authorization": f"Bearer {token}"},
    )
    print(f"  -> Response status: {resp.status_code}, body: {resp.text}")

def tail_log(path):
    with open(path, "r") as f:
        f.seek(0, 2)  # jump to end of file, only watch NEW lines
        while True:
            line = f.readline()
            if not line:
                time.sleep(1)
                continue
            yield line


if __name__ == "__main__":
    token = get_token()
    print(f"Got token: {token[:20] if token else 'NONE'}...")
    print("Watching Suricata alerts... (Ctrl+C to stop)")

    for line in tail_log(LOG_PATH):
        match = LINE_PATTERN.search(line)
        if not match:
            continue

        severity = PRIORITY_MAP.get(match.group("priority"), "low")
        send_alert(
            token,
            match.group("src"),
            match.group("dst"),
            match.group("message"),
            severity,
            line.strip(),
        )
        print(f"Sent alert: {match.group('message')} ({severity})")
