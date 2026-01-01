#!/usr/bin/env python3
"""Fetch Club Elo fixture data and save as parquet."""

import json
import logging
import sys
from datetime import datetime, timezone
from pathlib import Path
from urllib.request import urlopen

import pandas as pd

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)

TIMEOUT_SECONDS = 300  # 5 minutes


def update_log(log_path: Path, rows: int, columns: list, success: bool):
    """Update the fetch log with the latest run."""
    log = []
    if log_path.exists():
        log = json.loads(log_path.read_text())

    log.append({
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "success": success,
        "rows": rows,
        "columns": columns,
    })

    log_path.write_text(json.dumps(log, indent=2))


def fetch_and_save():
    """Fetch NAC Breda fixtures from Club Elo API and save as parquet."""
    url = "http://api.clubelo.com/FixturesBreda"
    data_dir = Path(__file__).parent.parent / "data" / "clubelo"
    output_path = data_dir / "fixtures_breda.parquet"
    log_path = data_dir / "fetch_log.json"

    logger.info(f"Fetching data from {url}")
    logger.info(f"Timeout set to {TIMEOUT_SECONDS} seconds")

    try:
        with urlopen(url, timeout=TIMEOUT_SECONDS) as response:
            logger.info(f"Response status: {response.status}")
            df = pd.read_csv(response)

        if df.empty:
            logger.error("API returned empty data")
            update_log(log_path, 0, [], success=False)
            sys.exit(1)

        logger.info(f"Fetched {len(df)} rows with columns: {list(df.columns)}")

        data_dir.mkdir(parents=True, exist_ok=True)
        df.to_parquet(output_path, index=False)

        update_log(log_path, len(df), list(df.columns), success=True)
        logger.info(f"Saved to {output_path}")
        logger.info(f"Updated log at {log_path}")

    except Exception as e:
        logger.error(f"Error fetching data: {e}")
        sys.exit(1)


if __name__ == "__main__":
    fetch_and_save()
