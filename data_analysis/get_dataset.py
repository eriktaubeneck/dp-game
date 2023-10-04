from pathlib import Path
from zipfile import ZipFile
import pandas
import requests
from tqdm import tqdm


dataset_url = "http://go.criteo.net/criteo-research-attribution-dataset.zip"
datainfo_url = "https://ailab.criteo.com/criteo-attribution-modeling-bidding-dataset/"
dir_path = Path("tmp")
zipfile_path = dir_path / Path("criteo_attribution_dataset.zip")
tarfile_path = dir_path / Path("criteo_attribution_dataset.tsv.gz")


def _download_file(url, output_path):
    response = requests.get(url, stream=True)

    if response.status_code == 200:
        # Get the total file size in bytes
        file_size = int(response.headers.get('content-length', 0))
        progress = tqdm(total=file_size, unit='B', unit_scale=True)

        with open(output_path, 'wb') as file:
            for data in response.iter_content(chunk_size=1024):
                file.write(data)
                progress.update(len(data))
        progress.close()

        print(f"File downloaded successfully as '{output_path}'.")
    else:
        raise Exception("Failed to download file.")


def _download_data():
    user_input = input(
        f"This analysis requires downloading the Criteo Attribution Dataset."
        f"\nInformation and terms about this dataset can be found at: {datainfo_url}"
        f"\nWould you like to continue? (Y/n)"
    )
    if user_input not in ("", "Y", "y"):
        raise Exception("User cancelled download.")

    _download_file(dataset_url, zipfile_path)


def _unzip_data():
    with ZipFile(zipfile_path, "r") as zipped_data:
        zipped_data.extractall("tmp")


def get_dataframe():
    if not dir_path.exists():
        dir_path.mkdir()
    if not zipfile_path.exists():
        _download_data()
    if not tarfile_path.exists():
        _unzip_data()
    return pandas.read_csv(tarfile_path, sep="\t", compression="gzip")
