# mlflow.data {#mlflow.data}

The `mlflow.data` module helps you record your model training and
evaluation datasets to runs with MLflow Tracking, as well as retrieve
dataset information from runs. It provides the following important
interfaces:

-   `Dataset <mlflow.data.dataset.Dataset>`: Represents a dataset used
    in model training or evaluation, including features, targets,
    predictions, and metadata such as the dataset's name, digest (hash)
    schema, profile, and source. You can log this metadata to a run in
    MLflow Tracking using the `mlflow.log_input()` API. `mlflow.data`
    provides APIs for constructing
    `Datasets <mlflow.data.dataset.Dataset>` from a variety of Python
    data objects, including Pandas DataFrames
    (`mlflow.data.from_pandas()`), NumPy arrays
    (`mlflow.data.from_numpy()`), Spark DataFrames
    (`mlflow.data.from_spark()` / `mlflow.data.load_delta()`), and more.
-   `DatasetSource <mlflow.data.dataset_source.DatasetSource>`:
    Represents the source of a dataset. For example, this may be a
    directory of files stored in S3, a Delta Table, or a web URL. Each
    `Dataset <mlflow.data.dataset.Dataset>` references the source from
    which it was derived. A `Dataset <mlflow.data.dataset.Dataset>`'s
    features and targets may differ from the source if transformations
    and filtering were applied. You can get the
    `DatasetSource <mlflow.data.dataset_source.DatasetSource>` of a
    dataset logged to a run in MLflow Tracking using the
    `mlflow.data.get_source()` API.

The following example demonstrates how to use `mlflow.data` to log a
training dataset to a run, retrieve information about the dataset from
the run, and load the dataset's source.

~~~ python
import mlflow.data
import pandas as pd
from mlflow.data.pandas_dataset import PandasDataset

# Construct a Pandas DataFrame using iris flower data from a web URL
dataset_source_url = "http://archive.ics.uci.edu/ml/machine-learning-databases/wine-quality/winequality-red.csv"
df = pd.read_csv(dataset_source_url)
# Construct an MLflow PandasDataset from the Pandas DataFrame, and specify the web URL
# as the source
dataset: PandasDataset = mlflow.data.from_pandas(df, source=dataset_source_url)

with mlflow.start_run():
    # Log the dataset to the MLflow Run. Specify the "training" context to indicate that the
    # dataset is used for model training
    mlflow.log_input(dataset, context="training")

# Retrieve the run, including dataset information
run = mlflow.get_run(mlflow.last_active_run().info.run_id)
dataset_info = run.inputs.dataset_inputs[0].dataset
print(f"Dataset name: {dataset_info.name}")
print(f"Dataset digest: {dataset_info.digest}")
print(f"Dataset profile: {dataset_info.profile}")
print(f"Dataset schema: {dataset_info.schema}")

# Load the dataset's source, which downloads the content from the source URL to the local
# filesystem
dataset_source = mlflow.data.get_source(dataset_info)
dataset_source.load()
~~~

<div class="autoclass" markdown="1" members="" undoc-members=""
show-inheritance="">

mlflow.data.dataset.Dataset

</div>

<div class="autoclass" markdown="1" members="" undoc-members=""
show-inheritance="" exclude-members="from_json">

mlflow.data.dataset_source.DatasetSource

<div class="method" markdown="1">

from_json(cls, source_json: str) -&gt; DatasetSource

</div>

</div>

<div class="autofunction" markdown="1">

mlflow.data.get_source

</div>

## pandas {#pandas}

<div class="autofunction" markdown="1">

mlflow.data.from_pandas

</div>

<div class="autoclass" markdown="1" members="" undoc-members=""
exclude-members="to_pyfunc, to_evaluation_dataset">

mlflow.data.pandas_dataset.PandasDataset()

</div>

## NumPy {#numpy}

<div class="autofunction" markdown="1">

mlflow.data.from_numpy

</div>

<div class="autoclass" markdown="1" members="" undoc-members=""
exclude-members="to_pyfunc, to_evaluation_dataset">

mlflow.data.numpy_dataset.NumpyDataset()

</div>

## Spark {#spark}

<div class="autofunction" markdown="1">

mlflow.data.load_delta

</div>

<div class="autofunction" markdown="1">

mlflow.data.from_spark

</div>

<div class="autoclass" markdown="1" members="" undoc-members=""
exclude-members="to_pyfunc, to_evaluation_dataset">

mlflow.data.spark_dataset.SparkDataset()

</div>

## Hugging Face {#hugging-face}

<div class="autofunction" markdown="1">

mlflow.data.huggingface_dataset.from_huggingface

</div>

<div class="autoclass" markdown="1" members="" undoc-members=""
exclude-members="to_pyfunc">

mlflow.data.huggingface_dataset.HuggingFaceDataset()

</div>

## TensorFlow {#tensorflow}

<div class="autofunction" markdown="1">

mlflow.data.tensorflow_dataset.from_tensorflow

</div>

<div class="autoclass" markdown="1" members="" undoc-members=""
exclude-members="to_pyfunc,">

mlflow.data.tensorflow_dataset.TensorFlowDataset()

</div>

<div class="autoclass" markdown="1" members="" undoc-members="">

mlflow.models.evaluation.base.EvaluationDataset()

</div>

## Dataset Sources {#dataset-sources}

<div class="autoclass" markdown="1" members="" undoc-members="">

mlflow.data.filesystem_dataset_source.FileSystemDatasetSource()

</div>

<div class="autoclass" markdown="1" members="" undoc-members="">

mlflow.data.http_dataset_source.HTTPDatasetSource()

</div>

<div class="autoclass" markdown="1" members="" undoc-members=""
exclude-members="">

mlflow.data.huggingface_dataset_source.HuggingFaceDatasetSource()

</div>

<div class="autoclass" markdown="1" members="" undoc-members="">

mlflow.data.delta_dataset_source.DeltaDatasetSource()

</div>

<div class="autoclass" markdown="1" members="" undoc-members="">

mlflow.data.spark_dataset_source.SparkDatasetSource()

</div>
