# REST API {#rest-api}

The MLflow REST API allows you to create, list, and get experiments and
runs, and log parameters, metrics, and artifacts. The API is hosted
under the `/api` route on the MLflow tracking server. For example, to
search for experiments on a tracking server hosted at
`http://localhost:5000`, make a POST request to
`http://localhost:5000/api/2.0/mlflow/experiments/search`.

<div class="contents" markdown="1" local="" depth="1">

Table of Contents

</div>

------------------------------------------------------------------------

## Create Experiment {#mlflowMlflowServicecreateExperiment}

<table style="width:69%;">
<colgroup>
<col style="width: 50%" />
<col style="width: 19%" />
</colgroup>
<thead>
<tr class="header">
<th><blockquote>
<p>Endpoint</p>
</blockquote></th>
<th>HTTP Method</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td><code>2.0/mlflow/experiments/create</code></td>
<td><code>POST</code></td>
</tr>
</tbody>
</table>

Create an experiment with a name. Returns the ID of the newly created
experiment. Validates that another experiment with the same name does
not already exist and fails if another experiment with the same name
already exists.

Throws `RESOURCE_ALREADY_EXISTS` if a experiment with the given name
exists.

### Request Structure {#mlflowCreateExperiment}

<table style="width:99%;">
<colgroup>
<col style="width: 12%" />
<col style="width: 25%" />
<col style="width: 61%" />
</colgroup>
<thead>
<tr class="header">
<th><blockquote>
<p>Field Name</p>
</blockquote></th>
<th><blockquote>
<p>Type</p>
</blockquote></th>
<th><blockquote>
<p>Description</p>
</blockquote></th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>name</td>
<td><code>STRING</code></td>
<td>Experiment name. This field is required.</td>
</tr>
<tr class="even">
<td>artifact_location</td>
<td><code>STRING</code></td>
<td>Location where all artifacts for the experiment are stored. If not
provided, the remote server will select an appropriate default.</td>
</tr>
<tr class="odd">
<td>tags</td>
<td>An array of <code class="interpreted-text"
role="ref">mlflowexperimenttag</code></td>
<td>A collection of tags to set on the experiment. Maximum tag size and
number of tags per request depends on the storage backend. All storage
backends are guaranteed to support tag keys up to 250 bytes in size and
tag values up to 5000 bytes in size. All storage backends are also
guaranteed to support up to 20 tags per request.</td>
</tr>
</tbody>
</table>

### Response Structure {#mlflowCreateExperimentResponse}

<table style="width:96%;">
<colgroup>
<col style="width: 22%" />
<col style="width: 18%" />
<col style="width: 55%" />
</colgroup>
<thead>
<tr class="header">
<th><blockquote>
<p>Field Name</p>
</blockquote></th>
<th><blockquote>
<p>Type</p>
</blockquote></th>
<th><blockquote>
<p>Description</p>
</blockquote></th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>experiment_id</td>
<td><code>STRING</code></td>
<td>Unique identifier for the experiment.</td>
</tr>
</tbody>
</table>

------------------------------------------------------------------------

## Search Experiments {#mlflowMlflowServicesearchExperiments}

<table style="width:69%;">
<colgroup>
<col style="width: 50%" />
<col style="width: 19%" />
</colgroup>
<thead>
<tr class="header">
<th><blockquote>
<p>Endpoint</p>
</blockquote></th>
<th>HTTP Method</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td><code>2.0/mlflow/experiments/search</code></td>
<td><code>POST</code></td>
</tr>
</tbody>
</table>

### Request Structure {#mlflowSearchExperiments}

<table style="width:99%;">
<colgroup>
<col style="width: 10%" />
<col style="width: 18%" />
<col style="width: 69%" />
</colgroup>
<thead>
<tr class="header">
<th>Field Name</th>
<th><blockquote>
<p>Type</p>
</blockquote></th>
<th><blockquote>
<p>Description</p>
</blockquote></th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>max_results</td>
<td><code>INT64</code></td>
<td>Maximum number of experiments desired. Servers may select a desired
default `max_results` value. All servers
are guaranteed to support a `max_results`
threshold of at least 1,000 but may support more. Callers of this
endpoint are encouraged to pass max_results explicitly and leverage
page_token to iterate through experiments.</td>
</tr>
<tr class="even">
<td>page_token</td>
<td><code>STRING</code></td>
<td>Token indicating the page of experiments to fetch</td>
</tr>
<tr class="odd">
<td>filter</td>
<td><code>STRING</code></td>
<td><p>A filter expression over experiment attributes and tags that
allows returning a subset of experiments. The syntax is a subset of SQL
that supports ANDing together binary operations between an attribute or
tag, and a constant.</p>
<p>Example: <code>name LIKE 'test-%' AND tags.key = 'value'</code></p>
<p>You can select columns with special characters (hyphen, space,
period, etc.) by using double quotes or backticks.</p>
<p>Example: <code>tags."extra-key" = 'value'</code> or
<code>tags.`extra-key` = 'value'</code></p>
<p>Supported operators are <code>=</code>, <code>!=</code>,
<code>LIKE</code>, and <code>ILIKE</code>.</p></td>
</tr>
<tr class="even">
<td>order_by</td>
<td>An array of <code>STRING</code></td>
<td>List of columns for ordering search results, which can include
experiment name and id with an optional "DESC" or "ASC" annotation,
where "ASC" is the default. Tiebreaks are done by experiment id
DESC.</td>
</tr>
<tr class="odd">
<td>view_type</td>
<td><code class="interpreted-text" role="ref">mlflowviewtype</code></td>
<td>Qualifier for type of experiments to be returned. If unspecified,
return only active experiments.</td>
</tr>
</tbody>
</table>

### Response Structure {#mlflowSearchExperimentsResponse}

<table style="width:99%;">
<colgroup>
<col style="width: 13%" />
<col style="width: 28%" />
<col style="width: 57%" />
</colgroup>
<thead>
<tr class="header">
<th><blockquote>
<p>Field Name</p>
</blockquote></th>
<th><blockquote>
<p>Type</p>
</blockquote></th>
<th><blockquote>
<p>Description</p>
</blockquote></th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>experiments</td>
<td>An array of <code class="interpreted-text"
role="ref">mlflowexperiment</code></td>
<td>Experiments that match the search criteria</td>
</tr>
<tr class="even">
<td>next_page_token</td>
<td><code>STRING</code></td>
<td>Token that can be used to retrieve the next page of experiments. An
empty token means that no more experiments are available for
retrieval.</td>
</tr>
</tbody>
</table>

------------------------------------------------------------------------

## Get Experiment {#mlflowMlflowServicegetExperiment}

<table style="width:65%;">
<colgroup>
<col style="width: 45%" />
<col style="width: 19%" />
</colgroup>
<thead>
<tr class="header">
<th><blockquote>
<p>Endpoint</p>
</blockquote></th>
<th>HTTP Method</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td><code>2.0/mlflow/experiments/get</code></td>
<td><code>GET</code></td>
</tr>
</tbody>
</table>

Get metadata for an experiment. This method works on deleted
experiments.

### Request Structure {#mlflowGetExperiment}

<table style="width:89%;">
<colgroup>
<col style="width: 22%" />
<col style="width: 18%" />
<col style="width: 48%" />
</colgroup>
<thead>
<tr class="header">
<th><blockquote>
<p>Field Name</p>
</blockquote></th>
<th><blockquote>
<p>Type</p>
</blockquote></th>
<th><blockquote>
<p>Description</p>
</blockquote></th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>experiment_id</td>
<td><code>STRING</code></td>
<td>ID of the associated experiment. This field is required.</td>
</tr>
</tbody>
</table>

### Response Structure {#mlflowGetExperimentResponse}

<table style="width:85%;">
<colgroup>
<col style="width: 18%" />
<col style="width: 36%" />
<col style="width: 30%" />
</colgroup>
<thead>
<tr class="header">
<th>Field Name</th>
<th><blockquote>
<p>Type</p>
</blockquote></th>
<th><blockquote>
<p>Description</p>
</blockquote></th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>experiment</td>
<td><code class="interpreted-text"
role="ref">mlflowexperiment</code></td>
<td>Experiment details.</td>
</tr>
</tbody>
</table>

------------------------------------------------------------------------

## Get Experiment By Name {#mlflowMlflowServicegetExperimentByName}

<table style="width:76%;">
<colgroup>
<col style="width: 56%" />
<col style="width: 19%" />
</colgroup>
<thead>
<tr class="header">
<th><blockquote>
<p>Endpoint</p>
</blockquote></th>
<th>HTTP Method</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td><code>2.0/mlflow/experiments/get-by-name</code></td>
<td><code>GET</code></td>
</tr>
</tbody>
</table>

Get metadata for an experiment.

This endpoint will return deleted experiments, but prefers the active
experiment if an active and deleted experiment share the same name. If
multiple deleted experiments share the same name, the API will return
one of them.

Throws `RESOURCE_DOES_NOT_EXIST` if no experiment with the specified
name exists.

### Request Structure {#mlflowGetExperimentByName}

<table style="width:94%;">
<colgroup>
<col style="width: 25%" />
<col style="width: 18%" />
<col style="width: 51%" />
</colgroup>
<thead>
<tr class="header">
<th><blockquote>
<p>Field Name</p>
</blockquote></th>
<th><blockquote>
<p>Type</p>
</blockquote></th>
<th><blockquote>
<p>Description</p>
</blockquote></th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>experiment_name</td>
<td><code>STRING</code></td>
<td>Name of the associated experiment. This field is required.</td>
</tr>
</tbody>
</table>

### Response Structure {#mlflowGetExperimentByNameResponse}

<table style="width:85%;">
<colgroup>
<col style="width: 18%" />
<col style="width: 36%" />
<col style="width: 30%" />
</colgroup>
<thead>
<tr class="header">
<th>Field Name</th>
<th><blockquote>
<p>Type</p>
</blockquote></th>
<th><blockquote>
<p>Description</p>
</blockquote></th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>experiment</td>
<td><code class="interpreted-text"
role="ref">mlflowexperiment</code></td>
<td>Experiment details.</td>
</tr>
</tbody>
</table>

------------------------------------------------------------------------

## Delete Experiment {#mlflowMlflowServicedeleteExperiment}

<table style="width:69%;">
<colgroup>
<col style="width: 50%" />
<col style="width: 19%" />
</colgroup>
<thead>
<tr class="header">
<th><blockquote>
<p>Endpoint</p>
</blockquote></th>
<th>HTTP Method</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td><code>2.0/mlflow/experiments/delete</code></td>
<td><code>POST</code></td>
</tr>
</tbody>
</table>

Mark an experiment and associated metadata, runs, metrics, params, and
tags for deletion. If the experiment uses FileStore, artifacts
associated with experiment are also deleted.

### Request Structure {#mlflowDeleteExperiment}

<table style="width:89%;">
<colgroup>
<col style="width: 22%" />
<col style="width: 18%" />
<col style="width: 48%" />
</colgroup>
<thead>
<tr class="header">
<th><blockquote>
<p>Field Name</p>
</blockquote></th>
<th><blockquote>
<p>Type</p>
</blockquote></th>
<th><blockquote>
<p>Description</p>
</blockquote></th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>experiment_id</td>
<td><code>STRING</code></td>
<td>ID of the associated experiment. This field is required.</td>
</tr>
</tbody>
</table>

------------------------------------------------------------------------

## Restore Experiment {#mlflowMlflowServicerestoreExperiment}

<table style="width:71%;">
<colgroup>
<col style="width: 51%" />
<col style="width: 19%" />
</colgroup>
<thead>
<tr class="header">
<th><blockquote>
<p>Endpoint</p>
</blockquote></th>
<th>HTTP Method</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td><code>2.0/mlflow/experiments/restore</code></td>
<td><code>POST</code></td>
</tr>
</tbody>
</table>

Restore an experiment marked for deletion. This also restores associated
metadata, runs, metrics, params, and tags. If experiment uses FileStore,
underlying artifacts associated with experiment are also restored.

Throws `RESOURCE_DOES_NOT_EXIST` if experiment was never created or was
permanently deleted.

### Request Structure {#mlflowRestoreExperiment}

<table style="width:89%;">
<colgroup>
<col style="width: 22%" />
<col style="width: 18%" />
<col style="width: 48%" />
</colgroup>
<thead>
<tr class="header">
<th><blockquote>
<p>Field Name</p>
</blockquote></th>
<th><blockquote>
<p>Type</p>
</blockquote></th>
<th><blockquote>
<p>Description</p>
</blockquote></th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>experiment_id</td>
<td><code>STRING</code></td>
<td>ID of the associated experiment. This field is required.</td>
</tr>
</tbody>
</table>

------------------------------------------------------------------------

## Update Experiment {#mlflowMlflowServiceupdateExperiment}

<table style="width:69%;">
<colgroup>
<col style="width: 50%" />
<col style="width: 19%" />
</colgroup>
<thead>
<tr class="header">
<th><blockquote>
<p>Endpoint</p>
</blockquote></th>
<th>HTTP Method</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td><code>2.0/mlflow/experiments/update</code></td>
<td><code>POST</code></td>
</tr>
</tbody>
</table>

Update experiment metadata.

### Request Structure {#mlflowUpdateExperiment}

<table style="width:99%;">
<colgroup>
<col style="width: 12%" />
<col style="width: 10%" />
<col style="width: 75%" />
</colgroup>
<thead>
<tr class="header">
<th><blockquote>
<p>Field Name</p>
</blockquote></th>
<th><blockquote>
<p>Type</p>
</blockquote></th>
<th><blockquote>
<p>Description</p>
</blockquote></th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>experiment_id</td>
<td><code>STRING</code></td>
<td>ID of the associated experiment. This field is required.</td>
</tr>
<tr class="even">
<td>new_name</td>
<td><code>STRING</code></td>
<td>If provided, the experiment's name is changed to the new name. The
new name must be unique.</td>
</tr>
</tbody>
</table>

------------------------------------------------------------------------

## Create Run {#mlflowMlflowServicecreateRun}

<table style="width:60%;">
<colgroup>
<col style="width: 40%" />
<col style="width: 19%" />
</colgroup>
<thead>
<tr class="header">
<th><blockquote>
<p>Endpoint</p>
</blockquote></th>
<th>HTTP Method</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td><code>2.0/mlflow/runs/create</code></td>
<td><code>POST</code></td>
</tr>
</tbody>
</table>

Create a new run within an experiment. A run is usually a single
execution of a machine learning or data ETL pipeline. MLflow uses runs
to track `mlflowParam`, `mlflowMetric`, and `mlflowRunTag` associated
with a single execution.

### Request Structure {#mlflowCreateRun}

<table style="width:99%;">
<colgroup>
<col style="width: 12%" />
<col style="width: 26%" />
<col style="width: 60%" />
</colgroup>
<thead>
<tr class="header">
<th><blockquote>
<p>Field Name</p>
</blockquote></th>
<th><blockquote>
<p>Type</p>
</blockquote></th>
<th><blockquote>
<p>Description</p>
</blockquote></th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>experiment_id</td>
<td><code>STRING</code></td>
<td>ID of the associated experiment.</td>
</tr>
<tr class="even">
<td>user_id</td>
<td><code>STRING</code></td>
<td>ID of the user executing the run. This field is deprecated as of
MLflow 1.0, and will be removed in a future MLflow release. Use
'mlflow.user' tag instead.</td>
</tr>
<tr class="odd">
<td>run_name</td>
<td><code>STRING</code></td>
<td>Name of the run.</td>
</tr>
<tr class="even">
<td>start_time</td>
<td><code>INT64</code></td>
<td>Unix timestamp in milliseconds of when the run started.</td>
</tr>
<tr class="odd">
<td>tags</td>
<td>An array of <code class="interpreted-text"
role="ref">mlflowruntag</code></td>
<td>Additional metadata for run.</td>
</tr>
</tbody>
</table>

### Response Structure {#mlflowCreateRunResponse}

<table style="width:79%;">
<colgroup>
<col style="width: 18%" />
<col style="width: 26%" />
<col style="width: 34%" />
</colgroup>
<thead>
<tr class="header">
<th>Field Name</th>
<th><blockquote>
<p>Type</p>
</blockquote></th>
<th><blockquote>
<p>Description</p>
</blockquote></th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>run</td>
<td><code class="interpreted-text" role="ref">mlflowrun</code></td>
<td>The newly created run.</td>
</tr>
</tbody>
</table>

------------------------------------------------------------------------

## Delete Run {#mlflowMlflowServicedeleteRun}

<table style="width:60%;">
<colgroup>
<col style="width: 40%" />
<col style="width: 19%" />
</colgroup>
<thead>
<tr class="header">
<th><blockquote>
<p>Endpoint</p>
</blockquote></th>
<th>HTTP Method</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td><code>2.0/mlflow/runs/delete</code></td>
<td><code>POST</code></td>
</tr>
</tbody>
</table>

Mark a run for deletion.

### Request Structure {#mlflowDeleteRun}

<table style="width:74%;">
<colgroup>
<col style="width: 18%" />
<col style="width: 18%" />
<col style="width: 37%" />
</colgroup>
<thead>
<tr class="header">
<th>Field Name</th>
<th><blockquote>
<p>Type</p>
</blockquote></th>
<th><blockquote>
<p>Description</p>
</blockquote></th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>run_id</td>
<td><code>STRING</code></td>
<td>ID of the run to delete. This field is required.</td>
</tr>
</tbody>
</table>

------------------------------------------------------------------------

## Restore Run {#mlflowMlflowServicerestoreRun}

<table style="width:61%;">
<colgroup>
<col style="width: 41%" />
<col style="width: 19%" />
</colgroup>
<thead>
<tr class="header">
<th><blockquote>
<p>Endpoint</p>
</blockquote></th>
<th>HTTP Method</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td><code>2.0/mlflow/runs/restore</code></td>
<td><code>POST</code></td>
</tr>
</tbody>
</table>

Restore a deleted run.

### Request Structure {#mlflowRestoreRun}

<table style="width:75%;">
<colgroup>
<col style="width: 18%" />
<col style="width: 18%" />
<col style="width: 38%" />
</colgroup>
<thead>
<tr class="header">
<th>Field Name</th>
<th><blockquote>
<p>Type</p>
</blockquote></th>
<th><blockquote>
<p>Description</p>
</blockquote></th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>run_id</td>
<td><code>STRING</code></td>
<td>ID of the run to restore. This field is required.</td>
</tr>
</tbody>
</table>

------------------------------------------------------------------------

## Get Run {#mlflowMlflowServicegetRun}

<table style="width:56%;">
<colgroup>
<col style="width: 36%" />
<col style="width: 19%" />
</colgroup>
<thead>
<tr class="header">
<th><blockquote>
<p>Endpoint</p>
</blockquote></th>
<th>HTTP Method</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td><code>2.0/mlflow/runs/get</code></td>
<td><code>GET</code></td>
</tr>
</tbody>
</table>

Get metadata, metrics, params, and tags for a run. In the case where
multiple metrics with the same key are logged for a run, return only the
value with the latest timestamp. If there are multiple values with the
latest timestamp, return the maximum of these values.

### Request Structure {#mlflowGetRun}

<table style="width:99%;">
<colgroup>
<col style="width: 12%" />
<col style="width: 12%" />
<col style="width: 73%" />
</colgroup>
<thead>
<tr class="header">
<th>Field Name</th>
<th><blockquote>
<p>Type</p>
</blockquote></th>
<th><blockquote>
<p>Description</p>
</blockquote></th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>run_id</td>
<td><code>STRING</code></td>
<td>ID of the run to fetch. Must be provided.</td>
</tr>
<tr class="even">
<td>run_uuid</td>
<td><code>STRING</code></td>
<td>[Deprecated, use run_id instead] ID of the run to fetch. This field
will be removed in a future MLflow version.</td>
</tr>
</tbody>
</table>

### Response Structure {#mlflowGetRunResponse}

<table style="width:99%;">
<colgroup>
<col style="width: 11%" />
<col style="width: 17%" />
<col style="width: 70%" />
</colgroup>
<thead>
<tr class="header">
<th>Field Name</th>
<th><blockquote>
<p>Type</p>
</blockquote></th>
<th><blockquote>
<p>Description</p>
</blockquote></th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>run</td>
<td><code class="interpreted-text" role="ref">mlflowrun</code></td>
<td>Run metadata (name, start time, etc) and data (metrics, params, and
tags).</td>
</tr>
</tbody>
</table>

------------------------------------------------------------------------

## Log Metric {#mlflowMlflowServicelogMetric}

<table style="width:65%;">
<colgroup>
<col style="width: 45%" />
<col style="width: 19%" />
</colgroup>
<thead>
<tr class="header">
<th><blockquote>
<p>Endpoint</p>
</blockquote></th>
<th>HTTP Method</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td><code>2.0/mlflow/runs/log-metric</code></td>
<td><code>POST</code></td>
</tr>
</tbody>
</table>

Log a metric for a run. A metric is a key-value pair (string key, float
value) with an associated timestamp. Examples include the various
metrics that represent ML model accuracy. A metric can be logged
multiple times.

### Request Structure {#mlflowLogMetric}

<table style="width:99%;">
<colgroup>
<col style="width: 10%" />
<col style="width: 10%" />
<col style="width: 78%" />
</colgroup>
<thead>
<tr class="header">
<th>Field Name</th>
<th><blockquote>
<p>Type</p>
</blockquote></th>
<th><blockquote>
<p>Description</p>
</blockquote></th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>run_id</td>
<td><code>STRING</code></td>
<td>ID of the run under which to log the metric. Must be provided.</td>
</tr>
<tr class="even">
<td>run_uuid</td>
<td><code>STRING</code></td>
<td>[Deprecated, use run_id instead] ID of the run under which to log
the metric. This field will be removed in a future MLflow version.</td>
</tr>
<tr class="odd">
<td>key</td>
<td><code>STRING</code></td>
<td>Name of the metric. This field is required.</td>
</tr>
<tr class="even">
<td>value</td>
<td><code>DOUBLE</code></td>
<td>Double value of the metric being logged. This field is
required.</td>
</tr>
<tr class="odd">
<td>timestamp</td>
<td><code>INT64</code></td>
<td>Unix timestamp in milliseconds at the time metric was logged. This
field is required.</td>
</tr>
<tr class="even">
<td>step</td>
<td><code>INT64</code></td>
<td>Step at which to log the metric</td>
</tr>
</tbody>
</table>

------------------------------------------------------------------------

## Log Batch {#mlflowMlflowServicelogBatch}

<table style="width:64%;">
<colgroup>
<col style="width: 44%" />
<col style="width: 19%" />
</colgroup>
<thead>
<tr class="header">
<th><blockquote>
<p>Endpoint</p>
</blockquote></th>
<th>HTTP Method</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td><code>2.0/mlflow/runs/log-batch</code></td>
<td><code>POST</code></td>
</tr>
</tbody>
</table>

Log a batch of metrics, params, and tags for a run. If any data failed
to be persisted, the server will respond with an error (non-200 status
code). In case of error (due to internal server error or an invalid
request), partial data may be written.

You can write metrics, params, and tags in interleaving fashion, but
within a given entity type are guaranteed to follow the order specified
in the request body. That is, for an API request like

~~~ json
{
   "run_id": "2a14ed5c6a87499199e0106c3501eab8",
   "metrics": [
     {"key": "mae", "value": 2.5, "timestamp": 1552550804},
     {"key": "rmse", "value": 2.7, "timestamp": 1552550804},
   ],
   "params": [
     {"key": "model_class", "value": "LogisticRegression"},
   ]
}
~~~

the server is guaranteed to write metric "rmse" after "mae", though it
may write param "model_class" before both metrics, after "mae", or after
both metrics.

The overwrite behavior for metrics, params, and tags is as follows:

-   Metrics: metric values are never overwritten. Logging a metric (key,
    value, timestamp) appends to the set of values for the metric with
    the provided key.
-   Tags: tag values can be overwritten by successive writes to the same
    tag key. That is, if multiple tag values with the same key are
    provided in the same API request, the last-provided tag value is
    written. Logging the same tag (key, value) is permitted - that is,
    logging a tag is idempotent.
-   Params: once written, param values cannot be changed (attempting to
    overwrite a param value will result in an error). However, logging
    the same param (key, value) is permitted - that is, logging a param
    is idempotent.

### Request Limits {#request-limits}

A single JSON-serialized API request may be up to 1 MB in size and
contain:

-   No more than 1000 metrics, params, and tags in total
-   Up to 1000 metrics
-   Up to 100 params
-   Up to 100 tags

For example, a valid request might contain 900 metrics, 50 params, and
50 tags, but logging 900 metrics, 50 params, and 51 tags is invalid. The
following limits also apply to metric, param, and tag keys and values:

-   Metric, param, and tag keys can be up to 250 characters in length
-   Param and tag values can be up to 250 characters in length

### Request Structure {#mlflowLogBatch}

<table style="width:99%;">
<colgroup>
<col style="width: 10%" />
<col style="width: 26%" />
<col style="width: 63%" />
</colgroup>
<thead>
<tr class="header">
<th>Field Name</th>
<th><blockquote>
<p>Type</p>
</blockquote></th>
<th><blockquote>
<p>Description</p>
</blockquote></th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>run_id</td>
<td><code>STRING</code></td>
<td>ID of the run to log under</td>
</tr>
<tr class="even">
<td>metrics</td>
<td>An array of <code class="interpreted-text"
role="ref">mlflowmetric</code></td>
<td>Metrics to log. A single request can contain up to 1000 metrics, and
up to 1000 metrics, params, and tags in total.</td>
</tr>
<tr class="odd">
<td>params</td>
<td>An array of <code class="interpreted-text"
role="ref">mlflowparam</code></td>
<td>Params to log. A single request can contain up to 100 params, and up
to 1000 metrics, params, and tags in total.</td>
</tr>
<tr class="even">
<td>tags</td>
<td>An array of <code class="interpreted-text"
role="ref">mlflowruntag</code></td>
<td>Tags to log. A single request can contain up to 100 tags, and up to
1000 metrics, params, and tags in total.</td>
</tr>
</tbody>
</table>

------------------------------------------------------------------------

## Log Model {#mlflowMlflowServicelogModel}

<table style="width:64%;">
<colgroup>
<col style="width: 44%" />
<col style="width: 19%" />
</colgroup>
<thead>
<tr class="header">
<th><blockquote>
<p>Endpoint</p>
</blockquote></th>
<th>HTTP Method</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td><code>2.0/mlflow/runs/log-model</code></td>
<td><code>POST</code></td>
</tr>
</tbody>
</table>

<div class="note" markdown="1">

<div class="title" markdown="1">

Note

</div>

Experimental: This API may change or be removed in a future release
without warning.

</div>

### Request Structure {#mlflowLogModel}

<table style="width:79%;">
<colgroup>
<col style="width: 18%" />
<col style="width: 18%" />
<col style="width: 43%" />
</colgroup>
<thead>
<tr class="header">
<th>Field Name</th>
<th><blockquote>
<p>Type</p>
</blockquote></th>
<th><blockquote>
<p>Description</p>
</blockquote></th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>run_id</td>
<td><code>STRING</code></td>
<td>ID of the run to log under</td>
</tr>
<tr class="even">
<td>model_json</td>
<td><code>STRING</code></td>
<td>MLmodel file in json format.</td>
</tr>
</tbody>
</table>

------------------------------------------------------------------------

## Log Inputs {#mlflowMlflowServicelogInputs}

<table style="width:65%;">
<colgroup>
<col style="width: 45%" />
<col style="width: 19%" />
</colgroup>
<thead>
<tr class="header">
<th><blockquote>
<p>Endpoint</p>
</blockquote></th>
<th>HTTP Method</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td><code>2.0/mlflow/runs/log-inputs</code></td>
<td><code>POST</code></td>
</tr>
</tbody>
</table>

<div class="note" markdown="1">

<div class="title" markdown="1">

Note

</div>

Experimental: This API may change or be removed in a future release
without warning.

</div>

### Request Structure {#mlflowLogInputs}

<div class="note" markdown="1">

<div class="title" markdown="1">

Note

</div>

Experimental: This API may change or be removed in a future release
without warning.

</div>

<table style="width:99%;">
<colgroup>
<col style="width: 15%" />
<col style="width: 48%" />
<col style="width: 34%" />
</colgroup>
<thead>
<tr class="header">
<th>Field Name</th>
<th><blockquote>
<p>Type</p>
</blockquote></th>
<th><blockquote>
<p>Description</p>
</blockquote></th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>run_id</td>
<td><code>STRING</code></td>
<td>ID of the run to log under This field is required.</td>
</tr>
<tr class="even">
<td>datasets</td>
<td>An array of <code class="interpreted-text"
role="ref">mlflowdatasetinput</code></td>
<td>Dataset inputs</td>
</tr>
</tbody>
</table>

------------------------------------------------------------------------

## Set Experiment Tag {#mlflowMlflowServicesetExperimentTag}

<table style="width:86%;">
<colgroup>
<col style="width: 66%" />
<col style="width: 19%" />
</colgroup>
<thead>
<tr class="header">
<th><blockquote>
<p>Endpoint</p>
</blockquote></th>
<th>HTTP Method</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td><code>2.0/mlflow/experiments/set-experiment-tag</code></td>
<td><code>POST</code></td>
</tr>
</tbody>
</table>

Set a tag on an experiment. Experiment tags are metadata that can be
updated.

### Request Structure {#mlflowSetExperimentTag}

<table style="width:99%;">
<colgroup>
<col style="width: 13%" />
<col style="width: 11%" />
<col style="width: 74%" />
</colgroup>
<thead>
<tr class="header">
<th><blockquote>
<p>Field Name</p>
</blockquote></th>
<th><blockquote>
<p>Type</p>
</blockquote></th>
<th><blockquote>
<p>Description</p>
</blockquote></th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>experiment_id</td>
<td><code>STRING</code></td>
<td>ID of the experiment under which to log the tag. Must be provided.
This field is required.</td>
</tr>
<tr class="even">
<td>key</td>
<td><code>STRING</code></td>
<td>Name of the tag. Maximum size depends on storage backend. All
storage backends are guaranteed to support key values up to 250 bytes in
size. This field is required.</td>
</tr>
<tr class="odd">
<td>value</td>
<td><code>STRING</code></td>
<td>String value of the tag being logged. Maximum size depends on
storage backend. All storage backends are guaranteed to support key
values up to 5000 bytes in size. This field is required.</td>
</tr>
</tbody>
</table>

------------------------------------------------------------------------

## Set Tag {#mlflowMlflowServicesetTag}

<table style="width:61%;">
<colgroup>
<col style="width: 41%" />
<col style="width: 19%" />
</colgroup>
<thead>
<tr class="header">
<th><blockquote>
<p>Endpoint</p>
</blockquote></th>
<th>HTTP Method</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td><code>2.0/mlflow/runs/set-tag</code></td>
<td><code>POST</code></td>
</tr>
</tbody>
</table>

Set a tag on a run. Tags are run metadata that can be updated during a
run and after a run completes.

### Request Structure {#mlflowSetTag}

<table style="width:99%;">
<colgroup>
<col style="width: 10%" />
<col style="width: 10%" />
<col style="width: 77%" />
</colgroup>
<thead>
<tr class="header">
<th>Field Name</th>
<th><blockquote>
<p>Type</p>
</blockquote></th>
<th><blockquote>
<p>Description</p>
</blockquote></th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>run_id</td>
<td><code>STRING</code></td>
<td>ID of the run under which to log the tag. Must be provided.</td>
</tr>
<tr class="even">
<td>run_uuid</td>
<td><code>STRING</code></td>
<td>[Deprecated, use run_id instead] ID of the run under which to log
the tag. This field will be removed in a future MLflow version.</td>
</tr>
<tr class="odd">
<td>key</td>
<td><code>STRING</code></td>
<td>Name of the tag. Maximum size depends on storage backend. All
storage backends are guaranteed to support key values up to 250 bytes in
size. This field is required.</td>
</tr>
<tr class="even">
<td>value</td>
<td><code>STRING</code></td>
<td>String value of the tag being logged. Maximum size depends on
storage backend. All storage backends are guaranteed to support key
values up to 5000 bytes in size. This field is required.</td>
</tr>
</tbody>
</table>

------------------------------------------------------------------------

## Delete Tag {#mlflowMlflowServicedeleteTag}

<table style="width:65%;">
<colgroup>
<col style="width: 45%" />
<col style="width: 19%" />
</colgroup>
<thead>
<tr class="header">
<th><blockquote>
<p>Endpoint</p>
</blockquote></th>
<th>HTTP Method</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td><code>2.0/mlflow/runs/delete-tag</code></td>
<td><code>POST</code></td>
</tr>
</tbody>
</table>

Delete a tag on a run. Tags are run metadata that can be updated during
a run and after a run completes.

### Request Structure {#mlflowDeleteTag}

<table style="width:99%;">
<colgroup>
<col style="width: 14%" />
<col style="width: 14%" />
<col style="width: 70%" />
</colgroup>
<thead>
<tr class="header">
<th>Field Name</th>
<th><blockquote>
<p>Type</p>
</blockquote></th>
<th><blockquote>
<p>Description</p>
</blockquote></th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>run_id</td>
<td><code>STRING</code></td>
<td>ID of the run that the tag was logged under. Must be provided. This
field is required.</td>
</tr>
<tr class="even">
<td>key</td>
<td><code>STRING</code></td>
<td>Name of the tag. Maximum size is 255 bytes. Must be provided. This
field is required.</td>
</tr>
</tbody>
</table>

------------------------------------------------------------------------

## Log Param {#mlflowMlflowServicelogParam}

<table style="width:69%;">
<colgroup>
<col style="width: 50%" />
<col style="width: 19%" />
</colgroup>
<thead>
<tr class="header">
<th><blockquote>
<p>Endpoint</p>
</blockquote></th>
<th>HTTP Method</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td><code>2.0/mlflow/runs/log-parameter</code></td>
<td><code>POST</code></td>
</tr>
</tbody>
</table>

Log a param used for a run. A param is a key-value pair (string key,
string value). Examples include hyperparameters used for ML model
training and constant dates and values used in an ETL pipeline. A param
can be logged only once for a run.

### Request Structure {#mlflowLogParam}

<table style="width:99%;">
<colgroup>
<col style="width: 10%" />
<col style="width: 10%" />
<col style="width: 77%" />
</colgroup>
<thead>
<tr class="header">
<th>Field Name</th>
<th><blockquote>
<p>Type</p>
</blockquote></th>
<th><blockquote>
<p>Description</p>
</blockquote></th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>run_id</td>
<td><code>STRING</code></td>
<td>ID of the run under which to log the param. Must be provided.</td>
</tr>
<tr class="even">
<td>run_uuid</td>
<td><code>STRING</code></td>
<td>[Deprecated, use run_id instead] ID of the run under which to log
the param. This field will be removed in a future MLflow version.</td>
</tr>
<tr class="odd">
<td>key</td>
<td><code>STRING</code></td>
<td>Name of the param. Maximum size is 255 bytes. This field is
required.</td>
</tr>
<tr class="even">
<td>value</td>
<td><code>STRING</code></td>
<td>String value of the param being logged. Maximum size is 500 bytes.
This field is required.</td>
</tr>
</tbody>
</table>

------------------------------------------------------------------------

## Get Metric History {#mlflowMlflowServicegetMetricHistory}

<table style="width:71%;">
<colgroup>
<col style="width: 51%" />
<col style="width: 19%" />
</colgroup>
<thead>
<tr class="header">
<th><blockquote>
<p>Endpoint</p>
</blockquote></th>
<th>HTTP Method</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td><code>2.0/mlflow/metrics/get-history</code></td>
<td><code>GET</code></td>
</tr>
</tbody>
</table>

Get a list of all values for the specified metric for a given run.

### Request Structure {#mlflowGetMetricHistory}

<table style="width:99%;">
<colgroup>
<col style="width: 11%" />
<col style="width: 10%" />
<col style="width: 77%" />
</colgroup>
<thead>
<tr class="header">
<th>Field Name</th>
<th><blockquote>
<p>Type</p>
</blockquote></th>
<th><blockquote>
<p>Description</p>
</blockquote></th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>run_id</td>
<td><code>STRING</code></td>
<td>ID of the run from which to fetch metric values. Must be
provided.</td>
</tr>
<tr class="even">
<td>run_uuid</td>
<td><code>STRING</code></td>
<td>[Deprecated, use run_id instead] ID of the run from which to fetch
metric values. This field will be removed in a future MLflow
version.</td>
</tr>
<tr class="odd">
<td>metric_key</td>
<td><code>STRING</code></td>
<td>Name of the metric. This field is required.</td>
</tr>
<tr class="even">
<td>page_token</td>
<td><code>STRING</code></td>
<td>Token indicating the page of metric history to fetch</td>
</tr>
<tr class="odd">
<td>max_results</td>
<td><code>INT32</code></td>
<td>Maximum number of logged instances of a metric for a run to return
per call. Backend servers may restrict the value of <span
class="title-ref">max_results</span> depending on performance
requirements. Requests that do not specify this value will behave as
non-paginated queries where all metric history values for a given metric
within a run are returned in a single response.</td>
</tr>
</tbody>
</table>

### Response Structure {#mlflowGetMetricHistoryResponse}

<table style="width:99%;">
<colgroup>
<col style="width: 12%" />
<col style="width: 24%" />
<col style="width: 61%" />
</colgroup>
<thead>
<tr class="header">
<th><blockquote>
<p>Field Name</p>
</blockquote></th>
<th><blockquote>
<p>Type</p>
</blockquote></th>
<th><blockquote>
<p>Description</p>
</blockquote></th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>metrics</td>
<td>An array of <code class="interpreted-text"
role="ref">mlflowmetric</code></td>
<td>All logged values for this metric.</td>
</tr>
<tr class="even">
<td>next_page_token</td>
<td><code>STRING</code></td>
<td>Token that can be used to issue a query for the next page of metric
history values. A missing token indicates that no additional metrics are
available to fetch.</td>
</tr>
</tbody>
</table>

------------------------------------------------------------------------

## Search Runs {#mlflowMlflowServicesearchRuns}

<table style="width:60%;">
<colgroup>
<col style="width: 40%" />
<col style="width: 19%" />
</colgroup>
<thead>
<tr class="header">
<th><blockquote>
<p>Endpoint</p>
</blockquote></th>
<th>HTTP Method</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td><code>2.0/mlflow/runs/search</code></td>
<td><code>POST</code></td>
</tr>
</tbody>
</table>

Search for runs that satisfy expressions. Search expressions can use
`mlflowMetric` and `mlflowParam` keys.

### Request Structure {#mlflowSearchRuns}

<table style="width:99%;">
<colgroup>
<col style="width: 11%" />
<col style="width: 17%" />
<col style="width: 70%" />
</colgroup>
<thead>
<tr class="header">
<th><blockquote>
<p>Field Name</p>
</blockquote></th>
<th><blockquote>
<p>Type</p>
</blockquote></th>
<th><blockquote>
<p>Description</p>
</blockquote></th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>experiment_ids</td>
<td>An array of <code>STRING</code></td>
<td>List of experiment IDs to search over.</td>
</tr>
<tr class="even">
<td>filter</td>
<td><code>STRING</code></td>
<td><p>A filter expression over params, metrics, and tags, that allows
returning a subset of runs. The syntax is a subset of SQL that supports
ANDing together binary operations between a param, metric, or tag and a
constant.</p>
<p>Example:
<code>metrics.rmse &lt; 1 and params.model_class = 'LogisticRegression'</code></p>
<p>You can select columns with special characters (hyphen, space,
period, etc.) by using double quotes:
<code>metrics."model class" = 'LinearRegression' and tags."user-name" = 'Tomas'</code></p>
<p>Supported operators are <code>=</code>, <code>!=</code>,
<code>&gt;</code>, <code>&gt;=</code>, <code>&lt;</code>, and
<code>&lt;=</code>.</p></td>
</tr>
<tr class="odd">
<td>run_view_type</td>
<td><code class="interpreted-text" role="ref">mlflowviewtype</code></td>
<td>Whether to display only active, only deleted, or all runs. Defaults
to only active runs.</td>
</tr>
<tr class="even">
<td>max_results</td>
<td><code>INT32</code></td>
<td>Maximum number of runs desired. If unspecified, defaults to 1000.
All servers are guaranteed to support a <span
class="title-ref">max_results</span> threshold of at least 50,000 but
may support more. Callers of this endpoint are encouraged to pass
max_results explicitly and leverage page_token to iterate through
experiments.</td>
</tr>
<tr class="odd">
<td>order_by</td>
<td>An array of <code>STRING</code></td>
<td>List of columns to be ordered by, including attributes, params,
metrics, and tags with an optional "DESC" or "ASC" annotation, where
"ASC" is the default. Example: ["params.input DESC", "metrics.alpha
ASC", "metrics.rmse"] Tiebreaks are done by start_time DESC followed by
run_id for runs with the same start time (and this is the default
ordering criterion if order_by is not provided).</td>
</tr>
<tr class="even">
<td>page_token</td>
<td><code>STRING</code></td>
<td></td>
</tr>
</tbody>
</table>

### Response Structure {#mlflowSearchRunsResponse}

<table style="width:99%;">
<colgroup>
<col style="width: 20%" />
<col style="width: 34%" />
<col style="width: 43%" />
</colgroup>
<thead>
<tr class="header">
<th><blockquote>
<p>Field Name</p>
</blockquote></th>
<th><blockquote>
<p>Type</p>
</blockquote></th>
<th><blockquote>
<p>Description</p>
</blockquote></th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>runs</td>
<td>An array of <code class="interpreted-text"
role="ref">mlflowrun</code></td>
<td>Runs that match the search criteria.</td>
</tr>
<tr class="even">
<td>next_page_token</td>
<td><code>STRING</code></td>
<td></td>
</tr>
</tbody>
</table>

------------------------------------------------------------------------

## List Artifacts {#mlflowMlflowServicelistArtifacts}

<table style="width:64%;">
<colgroup>
<col style="width: 44%" />
<col style="width: 19%" />
</colgroup>
<thead>
<tr class="header">
<th><blockquote>
<p>Endpoint</p>
</blockquote></th>
<th>HTTP Method</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td><code>2.0/mlflow/artifacts/list</code></td>
<td><code>GET</code></td>
</tr>
</tbody>
</table>

List artifacts for a run. Takes an optional `artifact_path` prefix which
if specified, the response contains only artifacts with the specified
prefix.

### Request Structure {#mlflowListArtifacts}

<table style="width:99%;">
<colgroup>
<col style="width: 11%" />
<col style="width: 11%" />
<col style="width: 76%" />
</colgroup>
<thead>
<tr class="header">
<th>Field Name</th>
<th><blockquote>
<p>Type</p>
</blockquote></th>
<th><blockquote>
<p>Description</p>
</blockquote></th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>run_id</td>
<td><code>STRING</code></td>
<td>ID of the run whose artifacts to list. Must be provided.</td>
</tr>
<tr class="even">
<td>run_uuid</td>
<td><code>STRING</code></td>
<td>[Deprecated, use run_id instead] ID of the run whose artifacts to
list. This field will be removed in a future MLflow version.</td>
</tr>
<tr class="odd">
<td>path</td>
<td><code>STRING</code></td>
<td>Filter artifacts matching this path (a relative path from the root
artifact directory).</td>
</tr>
<tr class="even">
<td>page_token</td>
<td><code>STRING</code></td>
<td>Token indicating the page of artifact results to fetch</td>
</tr>
</tbody>
</table>

### Response Structure {#mlflowListArtifactsResponse}

<table style="width:99%;">
<colgroup>
<col style="width: 14%" />
<col style="width: 28%" />
<col style="width: 56%" />
</colgroup>
<thead>
<tr class="header">
<th><blockquote>
<p>Field Name</p>
</blockquote></th>
<th><blockquote>
<p>Type</p>
</blockquote></th>
<th><blockquote>
<p>Description</p>
</blockquote></th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>root_uri</td>
<td><code>STRING</code></td>
<td>Root artifact directory for the run.</td>
</tr>
<tr class="even">
<td>files</td>
<td>An array of <code class="interpreted-text"
role="ref">mlflowfileinfo</code></td>
<td>File location and metadata for artifacts.</td>
</tr>
<tr class="odd">
<td>next_page_token</td>
<td><code>STRING</code></td>
<td>Token that can be used to retrieve the next page of artifact
results</td>
</tr>
</tbody>
</table>

------------------------------------------------------------------------

## Update Run {#mlflowMlflowServiceupdateRun}

<table style="width:60%;">
<colgroup>
<col style="width: 40%" />
<col style="width: 19%" />
</colgroup>
<thead>
<tr class="header">
<th><blockquote>
<p>Endpoint</p>
</blockquote></th>
<th>HTTP Method</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td><code>2.0/mlflow/runs/update</code></td>
<td><code>POST</code></td>
</tr>
</tbody>
</table>

Update run metadata.

### Request Structure {#mlflowUpdateRun}

<table style="width:99%;">
<colgroup>
<col style="width: 11%" />
<col style="width: 21%" />
<col style="width: 66%" />
</colgroup>
<thead>
<tr class="header">
<th>Field Name</th>
<th><blockquote>
<p>Type</p>
</blockquote></th>
<th><blockquote>
<p>Description</p>
</blockquote></th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>run_id</td>
<td><code>STRING</code></td>
<td>ID of the run to update. Must be provided.</td>
</tr>
<tr class="even">
<td>run_uuid</td>
<td><code>STRING</code></td>
<td>[Deprecated, use run_id instead] ID of the run to update.. This
field will be removed in a future MLflow version.</td>
</tr>
<tr class="odd">
<td>status</td>
<td><code class="interpreted-text"
role="ref">mlflowrunstatus</code></td>
<td>Updated status of the run.</td>
</tr>
<tr class="even">
<td>end_time</td>
<td><code>INT64</code></td>
<td>Unix timestamp in milliseconds of when the run ended.</td>
</tr>
<tr class="odd">
<td>run_name</td>
<td><code>STRING</code></td>
<td>Updated name of the run.</td>
</tr>
</tbody>
</table>

### Response Structure {#mlflowUpdateRunResponse}

<table style="width:93%;">
<colgroup>
<col style="width: 18%" />
<col style="width: 31%" />
<col style="width: 43%" />
</colgroup>
<thead>
<tr class="header">
<th>Field Name</th>
<th><blockquote>
<p>Type</p>
</blockquote></th>
<th><blockquote>
<p>Description</p>
</blockquote></th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>run_info</td>
<td><code class="interpreted-text" role="ref">mlflowruninfo</code></td>
<td>Updated metadata of the run.</td>
</tr>
</tbody>
</table>

------------------------------------------------------------------------

## Create RegisteredModel {#mlflowModelRegistryServicecreateRegisteredModel}

<table style="width:78%;">
<colgroup>
<col style="width: 58%" />
<col style="width: 19%" />
</colgroup>
<thead>
<tr class="header">
<th><blockquote>
<p>Endpoint</p>
</blockquote></th>
<th>HTTP Method</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td><code>2.0/mlflow/registered-models/create</code></td>
<td><code>POST</code></td>
</tr>
</tbody>
</table>

Throws `RESOURCE_ALREADY_EXISTS` if a registered model with the given
name exists.

### Request Structure {#mlflowCreateRegisteredModel}

<table style="width:99%;">
<colgroup>
<col style="width: 13%" />
<col style="width: 43%" />
<col style="width: 42%" />
</colgroup>
<thead>
<tr class="header">
<th>Field Name</th>
<th><blockquote>
<p>Type</p>
</blockquote></th>
<th><blockquote>
<p>Description</p>
</blockquote></th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>name</td>
<td><code>STRING</code></td>
<td>Register models under this name This field is required.</td>
</tr>
<tr class="even">
<td>tags</td>
<td>An array of <code class="interpreted-text"
role="ref">mlflowregisteredmodeltag</code></td>
<td>Additional metadata for registered model.</td>
</tr>
<tr class="odd">
<td>description</td>
<td><code>STRING</code></td>
<td>Optional description for registered model.</td>
</tr>
</tbody>
</table>

### Response Structure {#mlflowCreateRegisteredModelResponse}

<table style="width:89%;">
<colgroup>
<col style="width: 26%" />
<col style="width: 43%" />
<col style="width: 19%" />
</colgroup>
<thead>
<tr class="header">
<th><blockquote>
<p>Field Name</p>
</blockquote></th>
<th><blockquote>
<p>Type</p>
</blockquote></th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>registered_model</td>
<td><code class="interpreted-text"
role="ref">mlflowregisteredmodel</code></td>
<td></td>
</tr>
</tbody>
</table>

------------------------------------------------------------------------

## Get RegisteredModel {#mlflowModelRegistryServicegetRegisteredModel}

<table style="width:74%;">
<colgroup>
<col style="width: 54%" />
<col style="width: 19%" />
</colgroup>
<thead>
<tr class="header">
<th><blockquote>
<p>Endpoint</p>
</blockquote></th>
<th>HTTP Method</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td><code>2.0/mlflow/registered-models/get</code></td>
<td><code>GET</code></td>
</tr>
</tbody>
</table>

### Request Structure {#mlflowGetRegisteredModel}

<table style="width:96%;">
<colgroup>
<col style="width: 18%" />
<col style="width: 18%" />
<col style="width: 59%" />
</colgroup>
<thead>
<tr class="header">
<th>Field Name</th>
<th><blockquote>
<p>Type</p>
</blockquote></th>
<th><blockquote>
<p>Description</p>
</blockquote></th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>name</td>
<td><code>STRING</code></td>
<td>Registered model unique name identifier. This field is
required.</td>
</tr>
</tbody>
</table>

### Response Structure {#mlflowGetRegisteredModelResponse}

<table style="width:89%;">
<colgroup>
<col style="width: 26%" />
<col style="width: 43%" />
<col style="width: 19%" />
</colgroup>
<thead>
<tr class="header">
<th><blockquote>
<p>Field Name</p>
</blockquote></th>
<th><blockquote>
<p>Type</p>
</blockquote></th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>registered_model</td>
<td><code class="interpreted-text"
role="ref">mlflowregisteredmodel</code></td>
<td></td>
</tr>
</tbody>
</table>

------------------------------------------------------------------------

## Rename RegisteredModel {#mlflowModelRegistryServicerenameRegisteredModel}

<table style="width:78%;">
<colgroup>
<col style="width: 58%" />
<col style="width: 19%" />
</colgroup>
<thead>
<tr class="header">
<th><blockquote>
<p>Endpoint</p>
</blockquote></th>
<th>HTTP Method</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td><code>2.0/mlflow/registered-models/rename</code></td>
<td><code>POST</code></td>
</tr>
</tbody>
</table>

### Request Structure {#mlflowRenameRegisteredModel}

<table style="width:99%;">
<colgroup>
<col style="width: 14%" />
<col style="width: 14%" />
<col style="width: 70%" />
</colgroup>
<thead>
<tr class="header">
<th>Field Name</th>
<th><blockquote>
<p>Type</p>
</blockquote></th>
<th><blockquote>
<p>Description</p>
</blockquote></th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>name</td>
<td><code>STRING</code></td>
<td>Registered model unique name identifier. This field is
required.</td>
</tr>
<tr class="even">
<td>new_name</td>
<td><code>STRING</code></td>
<td>If provided, updates the name for this
<code>registered_model</code>.</td>
</tr>
</tbody>
</table>

### Response Structure {#mlflowRenameRegisteredModelResponse}

<table style="width:89%;">
<colgroup>
<col style="width: 26%" />
<col style="width: 43%" />
<col style="width: 19%" />
</colgroup>
<thead>
<tr class="header">
<th><blockquote>
<p>Field Name</p>
</blockquote></th>
<th><blockquote>
<p>Type</p>
</blockquote></th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>registered_model</td>
<td><code class="interpreted-text"
role="ref">mlflowregisteredmodel</code></td>
<td></td>
</tr>
</tbody>
</table>

------------------------------------------------------------------------

## Update RegisteredModel {#mlflowModelRegistryServiceupdateRegisteredModel}

<table style="width:78%;">
<colgroup>
<col style="width: 58%" />
<col style="width: 19%" />
</colgroup>
<thead>
<tr class="header">
<th><blockquote>
<p>Endpoint</p>
</blockquote></th>
<th>HTTP Method</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td><code>2.0/mlflow/registered-models/update</code></td>
<td><code>PATCH</code></td>
</tr>
</tbody>
</table>

### Request Structure {#mlflowUpdateRegisteredModel}

<table style="width:99%;">
<colgroup>
<col style="width: 14%" />
<col style="width: 13%" />
<col style="width: 71%" />
</colgroup>
<thead>
<tr class="header">
<th>Field Name</th>
<th><blockquote>
<p>Type</p>
</blockquote></th>
<th><blockquote>
<p>Description</p>
</blockquote></th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>name</td>
<td><code>STRING</code></td>
<td>Registered model unique name identifier. This field is
required.</td>
</tr>
<tr class="even">
<td>description</td>
<td><code>STRING</code></td>
<td>If provided, updates the description for this
<code>registered_model</code>.</td>
</tr>
</tbody>
</table>

### Response Structure {#mlflowUpdateRegisteredModelResponse}

<table style="width:89%;">
<colgroup>
<col style="width: 26%" />
<col style="width: 43%" />
<col style="width: 19%" />
</colgroup>
<thead>
<tr class="header">
<th><blockquote>
<p>Field Name</p>
</blockquote></th>
<th><blockquote>
<p>Type</p>
</blockquote></th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>registered_model</td>
<td><code class="interpreted-text"
role="ref">mlflowregisteredmodel</code></td>
<td></td>
</tr>
</tbody>
</table>

------------------------------------------------------------------------

## Delete RegisteredModel {#mlflowModelRegistryServicedeleteRegisteredModel}

<table style="width:78%;">
<colgroup>
<col style="width: 58%" />
<col style="width: 19%" />
</colgroup>
<thead>
<tr class="header">
<th><blockquote>
<p>Endpoint</p>
</blockquote></th>
<th>HTTP Method</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td><code>2.0/mlflow/registered-models/delete</code></td>
<td><code>DELETE</code></td>
</tr>
</tbody>
</table>

### Request Structure {#mlflowDeleteRegisteredModel}

<table style="width:96%;">
<colgroup>
<col style="width: 18%" />
<col style="width: 18%" />
<col style="width: 59%" />
</colgroup>
<thead>
<tr class="header">
<th>Field Name</th>
<th><blockquote>
<p>Type</p>
</blockquote></th>
<th><blockquote>
<p>Description</p>
</blockquote></th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>name</td>
<td><code>STRING</code></td>
<td>Registered model unique name identifier. This field is
required.</td>
</tr>
</tbody>
</table>

------------------------------------------------------------------------

## Get Latest ModelVersions {#mlflowModelRegistryServicegetLatestVersions}

<table style="width:96%;">
<colgroup>
<col style="width: 76%" />
<col style="width: 19%" />
</colgroup>
<thead>
<tr class="header">
<th><blockquote>
<p>Endpoint</p>
</blockquote></th>
<th>HTTP Method</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td><code>2.0/mlflow/registered-models/get-latest-versions</code></td>
<td><code>POST</code></td>
</tr>
</tbody>
</table>

### Request Structure {#mlflowGetLatestVersions}

<table style="width:99%;">
<colgroup>
<col style="width: 15%" />
<col style="width: 30%" />
<col style="width: 52%" />
</colgroup>
<thead>
<tr class="header">
<th>Field Name</th>
<th><blockquote>
<p>Type</p>
</blockquote></th>
<th><blockquote>
<p>Description</p>
</blockquote></th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>name</td>
<td><code>STRING</code></td>
<td>Registered model unique name identifier. This field is
required.</td>
</tr>
<tr class="even">
<td>stages</td>
<td>An array of <code>STRING</code></td>
<td>List of stages.</td>
</tr>
</tbody>
</table>

### Response Structure {#mlflowGetLatestVersionsResponse}

<table style="width:99%;">
<colgroup>
<col style="width: 10%" />
<col style="width: 25%" />
<col style="width: 63%" />
</colgroup>
<thead>
<tr class="header">
<th><blockquote>
<p>Field Name</p>
</blockquote></th>
<th><blockquote>
<p>Type</p>
</blockquote></th>
<th><blockquote>
<p>Description</p>
</blockquote></th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>model_versions</td>
<td>An array of <code class="interpreted-text"
role="ref">mlflowmodelversion</code></td>
<td>Latest version models for each requests stage. Only return models
with current <code>READY</code> status. If no <code>stages</code>
provided, returns the latest version for each stage, including
<code>"None"</code>.</td>
</tr>
</tbody>
</table>

------------------------------------------------------------------------

## Create ModelVersion {#mlflowModelRegistryServicecreateModelVersion}

<table style="width:74%;">
<colgroup>
<col style="width: 54%" />
<col style="width: 19%" />
</colgroup>
<thead>
<tr class="header">
<th><blockquote>
<p>Endpoint</p>
</blockquote></th>
<th>HTTP Method</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td><code>2.0/mlflow/model-versions/create</code></td>
<td><code>POST</code></td>
</tr>
</tbody>
</table>

### Request Structure {#mlflowCreateModelVersion}

<table style="width:99%;">
<colgroup>
<col style="width: 9%" />
<col style="width: 29%" />
<col style="width: 60%" />
</colgroup>
<thead>
<tr class="header">
<th>Field Name</th>
<th><blockquote>
<p>Type</p>
</blockquote></th>
<th><blockquote>
<p>Description</p>
</blockquote></th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>name</td>
<td><code>STRING</code></td>
<td>Register model under this name This field is required.</td>
</tr>
<tr class="even">
<td>source</td>
<td><code>STRING</code></td>
<td>URI indicating the location of the model artifacts. This field is
required.</td>
</tr>
<tr class="odd">
<td>run_id</td>
<td><code>STRING</code></td>
<td>MLflow run ID for correlation, if <code>source</code> was generated
by an experiment run in MLflow tracking server</td>
</tr>
<tr class="even">
<td>tags</td>
<td>An array of <code class="interpreted-text"
role="ref">mlflowmodelversiontag</code></td>
<td>Additional metadata for model version.</td>
</tr>
<tr class="odd">
<td>run_link</td>
<td><code>STRING</code></td>
<td>MLflow run link - this is the exact link of the run that generated
this model version, potentially hosted at another instance of
MLflow.</td>
</tr>
<tr class="even">
<td>description</td>
<td><code>STRING</code></td>
<td>Optional description for model version.</td>
</tr>
</tbody>
</table>

### Response Structure {#mlflowCreateModelVersionResponse}

<table style="width:99%;">
<colgroup>
<col style="width: 14%" />
<col style="width: 25%" />
<col style="width: 59%" />
</colgroup>
<thead>
<tr class="header">
<th><blockquote>
<p>Field Name</p>
</blockquote></th>
<th><blockquote>
<p>Type</p>
</blockquote></th>
<th><blockquote>
<p>Description</p>
</blockquote></th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>model_version</td>
<td><code class="interpreted-text"
role="ref">mlflowmodelversion</code></td>
<td>Return new version number generated for this model in registry.</td>
</tr>
</tbody>
</table>

------------------------------------------------------------------------

## Get ModelVersion {#mlflowModelRegistryServicegetModelVersion}

<table style="width:69%;">
<colgroup>
<col style="width: 50%" />
<col style="width: 19%" />
</colgroup>
<thead>
<tr class="header">
<th><blockquote>
<p>Endpoint</p>
</blockquote></th>
<th>HTTP Method</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td><code>2.0/mlflow/model-versions/get</code></td>
<td><code>GET</code></td>
</tr>
</tbody>
</table>

### Request Structure {#mlflowGetModelVersion}

<table style="width:79%;">
<colgroup>
<col style="width: 18%" />
<col style="width: 18%" />
<col style="width: 43%" />
</colgroup>
<thead>
<tr class="header">
<th>Field Name</th>
<th><blockquote>
<p>Type</p>
</blockquote></th>
<th><blockquote>
<p>Description</p>
</blockquote></th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>name</td>
<td><code>STRING</code></td>
<td>Name of the registered model This field is required.</td>
</tr>
<tr class="even">
<td>version</td>
<td><code>STRING</code></td>
<td>Model version number This field is required.</td>
</tr>
</tbody>
</table>

### Response Structure {#mlflowGetModelVersionResponse}

<table style="width:81%;">
<colgroup>
<col style="width: 22%" />
<col style="width: 38%" />
<col style="width: 19%" />
</colgroup>
<thead>
<tr class="header">
<th><blockquote>
<p>Field Name</p>
</blockquote></th>
<th><blockquote>
<p>Type</p>
</blockquote></th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>model_version</td>
<td><code class="interpreted-text"
role="ref">mlflowmodelversion</code></td>
<td></td>
</tr>
</tbody>
</table>

------------------------------------------------------------------------

## Update ModelVersion {#mlflowModelRegistryServiceupdateModelVersion}

<table style="width:74%;">
<colgroup>
<col style="width: 54%" />
<col style="width: 19%" />
</colgroup>
<thead>
<tr class="header">
<th><blockquote>
<p>Endpoint</p>
</blockquote></th>
<th>HTTP Method</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td><code>2.0/mlflow/model-versions/update</code></td>
<td><code>PATCH</code></td>
</tr>
</tbody>
</table>

### Request Structure {#mlflowUpdateModelVersion}

<table style="width:99%;">
<colgroup>
<col style="width: 14%" />
<col style="width: 13%" />
<col style="width: 71%" />
</colgroup>
<thead>
<tr class="header">
<th>Field Name</th>
<th><blockquote>
<p>Type</p>
</blockquote></th>
<th><blockquote>
<p>Description</p>
</blockquote></th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>name</td>
<td><code>STRING</code></td>
<td>Name of the registered model This field is required.</td>
</tr>
<tr class="even">
<td>version</td>
<td><code>STRING</code></td>
<td>Model version number This field is required.</td>
</tr>
<tr class="odd">
<td>description</td>
<td><code>STRING</code></td>
<td>If provided, updates the description for this
<code>registered_model</code>.</td>
</tr>
</tbody>
</table>

### Response Structure {#mlflowUpdateModelVersionResponse}

<table style="width:99%;">
<colgroup>
<col style="width: 14%" />
<col style="width: 25%" />
<col style="width: 59%" />
</colgroup>
<thead>
<tr class="header">
<th><blockquote>
<p>Field Name</p>
</blockquote></th>
<th><blockquote>
<p>Type</p>
</blockquote></th>
<th><blockquote>
<p>Description</p>
</blockquote></th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>model_version</td>
<td><code class="interpreted-text"
role="ref">mlflowmodelversion</code></td>
<td>Return new version number generated for this model in registry.</td>
</tr>
</tbody>
</table>

------------------------------------------------------------------------

## Delete ModelVersion {#mlflowModelRegistryServicedeleteModelVersion}

<table style="width:74%;">
<colgroup>
<col style="width: 54%" />
<col style="width: 19%" />
</colgroup>
<thead>
<tr class="header">
<th><blockquote>
<p>Endpoint</p>
</blockquote></th>
<th>HTTP Method</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td><code>2.0/mlflow/model-versions/delete</code></td>
<td><code>DELETE</code></td>
</tr>
</tbody>
</table>

### Request Structure {#mlflowDeleteModelVersion}

<table style="width:79%;">
<colgroup>
<col style="width: 18%" />
<col style="width: 18%" />
<col style="width: 43%" />
</colgroup>
<thead>
<tr class="header">
<th>Field Name</th>
<th><blockquote>
<p>Type</p>
</blockquote></th>
<th><blockquote>
<p>Description</p>
</blockquote></th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>name</td>
<td><code>STRING</code></td>
<td>Name of the registered model This field is required.</td>
</tr>
<tr class="even">
<td>version</td>
<td><code>STRING</code></td>
<td>Model version number This field is required.</td>
</tr>
</tbody>
</table>

------------------------------------------------------------------------

## Search ModelVersions {#mlflowModelRegistryServicesearchModelVersions}

<table style="width:74%;">
<colgroup>
<col style="width: 54%" />
<col style="width: 19%" />
</colgroup>
<thead>
<tr class="header">
<th><blockquote>
<p>Endpoint</p>
</blockquote></th>
<th>HTTP Method</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td><code>2.0/mlflow/model-versions/search</code></td>
<td><code>GET</code></td>
</tr>
</tbody>
</table>

### Request Structure {#mlflowSearchModelVersions}

<table style="width:99%;">
<colgroup>
<col style="width: 10%" />
<col style="width: 18%" />
<col style="width: 70%" />
</colgroup>
<thead>
<tr class="header">
<th>Field Name</th>
<th><blockquote>
<p>Type</p>
</blockquote></th>
<th><blockquote>
<p>Description</p>
</blockquote></th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>filter</td>
<td><code>STRING</code></td>
<td>String filter condition, like "name='my-model-name'". Must be a
single boolean condition, with string values wrapped in single
quotes.</td>
</tr>
<tr class="even">
<td>max_results</td>
<td><code>INT64</code></td>
<td>Maximum number of models desired. Max threshold is 200K. Backends
may choose a lower default value and maximum threshold.</td>
</tr>
<tr class="odd">
<td>order_by</td>
<td>An array of <code>STRING</code></td>
<td>List of columns to be ordered by including model name, version,
stage with an optional "DESC" or "ASC" annotation, where "ASC" is the
default. Tiebreaks are done by latest stage transition timestamp,
followed by name ASC, followed by version DESC.</td>
</tr>
<tr class="even">
<td>page_token</td>
<td><code>STRING</code></td>
<td>Pagination token to go to next page based on previous search
query.</td>
</tr>
</tbody>
</table>

### Response Structure {#mlflowSearchModelVersionsResponse}

<table style="width:99%;">
<colgroup>
<col style="width: 13%" />
<col style="width: 29%" />
<col style="width: 56%" />
</colgroup>
<thead>
<tr class="header">
<th><blockquote>
<p>Field Name</p>
</blockquote></th>
<th><blockquote>
<p>Type</p>
</blockquote></th>
<th><blockquote>
<p>Description</p>
</blockquote></th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>model_versions</td>
<td>An array of <code class="interpreted-text"
role="ref">mlflowmodelversion</code></td>
<td>Models that match the search criteria</td>
</tr>
<tr class="even">
<td>next_page_token</td>
<td><code>STRING</code></td>
<td>Pagination token to request next page of models for the same search
query.</td>
</tr>
</tbody>
</table>

------------------------------------------------------------------------

## Get Download URI For ModelVersion Artifacts {#mlflowModelRegistryServicegetModelVersionDownloadUri}

<table style="width:88%;">
<colgroup>
<col style="width: 68%" />
<col style="width: 19%" />
</colgroup>
<thead>
<tr class="header">
<th><blockquote>
<p>Endpoint</p>
</blockquote></th>
<th>HTTP Method</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td><code>2.0/mlflow/model-versions/get-download-uri</code></td>
<td><code>GET</code></td>
</tr>
</tbody>
</table>

### Request Structure {#mlflowGetModelVersionDownloadUri}

<table style="width:79%;">
<colgroup>
<col style="width: 18%" />
<col style="width: 18%" />
<col style="width: 43%" />
</colgroup>
<thead>
<tr class="header">
<th>Field Name</th>
<th><blockquote>
<p>Type</p>
</blockquote></th>
<th><blockquote>
<p>Description</p>
</blockquote></th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>name</td>
<td><code>STRING</code></td>
<td>Name of the registered model This field is required.</td>
</tr>
<tr class="even">
<td>version</td>
<td><code>STRING</code></td>
<td>Model version number This field is required.</td>
</tr>
</tbody>
</table>

### Response Structure {#mlflowGetModelVersionDownloadUriResponse}

<table style="width:99%;">
<colgroup>
<col style="width: 14%" />
<col style="width: 12%" />
<col style="width: 71%" />
</colgroup>
<thead>
<tr class="header">
<th><blockquote>
<p>Field Name</p>
</blockquote></th>
<th><blockquote>
<p>Type</p>
</blockquote></th>
<th><blockquote>
<p>Description</p>
</blockquote></th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>artifact_uri</td>
<td><code>STRING</code></td>
<td>URI corresponding to where artifacts for this model version are
stored.</td>
</tr>
</tbody>
</table>

------------------------------------------------------------------------

## Transition ModelVersion Stage {#mlflowModelRegistryServicetransitionModelVersionStage}

<table style="width:88%;">
<colgroup>
<col style="width: 68%" />
<col style="width: 19%" />
</colgroup>
<thead>
<tr class="header">
<th><blockquote>
<p>Endpoint</p>
</blockquote></th>
<th>HTTP Method</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td><code>2.0/mlflow/model-versions/transition-stage</code></td>
<td><code>POST</code></td>
</tr>
</tbody>
</table>

### Request Structure {#mlflowTransitionModelVersionStage}

<table style="width:99%;">
<colgroup>
<col style="width: 20%" />
<col style="width: 9%" />
<col style="width: 68%" />
</colgroup>
<thead>
<tr class="header">
<th><blockquote>
<p>Field Name</p>
</blockquote></th>
<th><blockquote>
<p>Type</p>
</blockquote></th>
<th><blockquote>
<p>Description</p>
</blockquote></th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>name</td>
<td><code>STRING</code></td>
<td>Name of the registered model This field is required.</td>
</tr>
<tr class="even">
<td>version</td>
<td><code>STRING</code></td>
<td>Model version number This field is required.</td>
</tr>
<tr class="odd">
<td>stage</td>
<td><code>STRING</code></td>
<td>Transition `model_version` to new
stage. This field is required.</td>
</tr>
<tr class="even">
<td>archive_existing_versions</td>
<td><code>BOOL</code></td>
<td>When transitioning a model version to a particular stage, this flag
dictates whether all existing model versions in that stage should be
atomically moved to the "archived" stage. This ensures that at-most-one
model version exists in the target stage. This field is
<em>required</em> when transitioning a model versions's stage This field
is required.</td>
</tr>
</tbody>
</table>

### Response Structure {#mlflowTransitionModelVersionStageResponse}

<table style="width:94%;">
<colgroup>
<col style="width: 22%" />
<col style="width: 38%" />
<col style="width: 33%" />
</colgroup>
<thead>
<tr class="header">
<th><blockquote>
<p>Field Name</p>
</blockquote></th>
<th><blockquote>
<p>Type</p>
</blockquote></th>
<th><blockquote>
<p>Description</p>
</blockquote></th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>model_version</td>
<td><code class="interpreted-text"
role="ref">mlflowmodelversion</code></td>
<td>Updated model version</td>
</tr>
</tbody>
</table>

------------------------------------------------------------------------

## Search RegisteredModels {#mlflowModelRegistryServicesearchRegisteredModels}

<table style="width:78%;">
<colgroup>
<col style="width: 58%" />
<col style="width: 19%" />
</colgroup>
<thead>
<tr class="header">
<th><blockquote>
<p>Endpoint</p>
</blockquote></th>
<th>HTTP Method</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td><code>2.0/mlflow/registered-models/search</code></td>
<td><code>GET</code></td>
</tr>
</tbody>
</table>

### Request Structure {#mlflowSearchRegisteredModels}

<table style="width:99%;">
<colgroup>
<col style="width: 10%" />
<col style="width: 18%" />
<col style="width: 69%" />
</colgroup>
<thead>
<tr class="header">
<th>Field Name</th>
<th><blockquote>
<p>Type</p>
</blockquote></th>
<th><blockquote>
<p>Description</p>
</blockquote></th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>filter</td>
<td><code>STRING</code></td>
<td>String filter condition, like "name LIKE 'my-model-name'".
Interpreted in the backend automatically as "name LIKE
'%my-model-name%'". Single boolean condition, with string values wrapped
in single quotes.</td>
</tr>
<tr class="even">
<td>max_results</td>
<td><code>INT64</code></td>
<td>Maximum number of models desired. Default is 100. Max threshold is
1000.</td>
</tr>
<tr class="odd">
<td>order_by</td>
<td>An array of <code>STRING</code></td>
<td>List of columns for ordering search results, which can include model
name and last updated timestamp with an optional "DESC" or "ASC"
annotation, where "ASC" is the default. Tiebreaks are done by model name
ASC.</td>
</tr>
<tr class="even">
<td>page_token</td>
<td><code>STRING</code></td>
<td>Pagination token to go to the next page based on a previous search
query.</td>
</tr>
</tbody>
</table>

### Response Structure {#mlflowSearchRegisteredModelsResponse}

<table style="width:99%;">
<colgroup>
<col style="width: 16%" />
<col style="width: 36%" />
<col style="width: 46%" />
</colgroup>
<thead>
<tr class="header">
<th><blockquote>
<p>Field Name</p>
</blockquote></th>
<th><blockquote>
<p>Type</p>
</blockquote></th>
<th><blockquote>
<p>Description</p>
</blockquote></th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>registered_models</td>
<td>An array of <code class="interpreted-text"
role="ref">mlflowregisteredmodel</code></td>
<td>Registered Models that match the search criteria.</td>
</tr>
<tr class="even">
<td>next_page_token</td>
<td><code>STRING</code></td>
<td>Pagination token to request the next page of models.</td>
</tr>
</tbody>
</table>

------------------------------------------------------------------------

## Set Registered Model Tag {#mlflowModelRegistryServicesetRegisteredModelTag}

<table style="width:79%;">
<colgroup>
<col style="width: 59%" />
<col style="width: 19%" />
</colgroup>
<thead>
<tr class="header">
<th><blockquote>
<p>Endpoint</p>
</blockquote></th>
<th>HTTP Method</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td><code>2.0/mlflow/registered-models/set-tag</code></td>
<td><code>POST</code></td>
</tr>
</tbody>
</table>

### Request Structure {#mlflowSetRegisteredModelTag}

<table style="width:99%;">
<colgroup>
<col style="width: 9%" />
<col style="width: 9%" />
<col style="width: 79%" />
</colgroup>
<thead>
<tr class="header">
<th>Field Name</th>
<th><blockquote>
<p>Type</p>
</blockquote></th>
<th><blockquote>
<p>Description</p>
</blockquote></th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>name</td>
<td><code>STRING</code></td>
<td>Unique name of the model. This field is required.</td>
</tr>
<tr class="even">
<td>key</td>
<td><code>STRING</code></td>
<td>Name of the tag. Maximum size depends on storage backend. If a tag
with this name already exists, its preexisting value will be replaced by
the specified `value`. All storage backends
are guaranteed to support key values up to 250 bytes in size. This field
is required.</td>
</tr>
<tr class="odd">
<td>value</td>
<td><code>STRING</code></td>
<td>String value of the tag being logged. Maximum size depends on
storage backend. This field is required.</td>
</tr>
</tbody>
</table>

------------------------------------------------------------------------

## Set Model Version Tag {#mlflowModelRegistryServicesetModelVersionTag}

<table style="width:75%;">
<colgroup>
<col style="width: 55%" />
<col style="width: 19%" />
</colgroup>
<thead>
<tr class="header">
<th><blockquote>
<p>Endpoint</p>
</blockquote></th>
<th>HTTP Method</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td><code>2.0/mlflow/model-versions/set-tag</code></td>
<td><code>POST</code></td>
</tr>
</tbody>
</table>

### Request Structure {#mlflowSetModelVersionTag}

<table style="width:99%;">
<colgroup>
<col style="width: 9%" />
<col style="width: 9%" />
<col style="width: 79%" />
</colgroup>
<thead>
<tr class="header">
<th>Field Name</th>
<th><blockquote>
<p>Type</p>
</blockquote></th>
<th><blockquote>
<p>Description</p>
</blockquote></th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>name</td>
<td><code>STRING</code></td>
<td>Unique name of the model. This field is required.</td>
</tr>
<tr class="even">
<td>version</td>
<td><code>STRING</code></td>
<td>Model version number. This field is required.</td>
</tr>
<tr class="odd">
<td>key</td>
<td><code>STRING</code></td>
<td>Name of the tag. Maximum size depends on storage backend. If a tag
with this name already exists, its preexisting value will be replaced by
the specified `value`. All storage backends
are guaranteed to support key values up to 250 bytes in size. This field
is required.</td>
</tr>
<tr class="even">
<td>value</td>
<td><code>STRING</code></td>
<td>String value of the tag being logged. Maximum size depends on
storage backend. This field is required.</td>
</tr>
</tbody>
</table>

------------------------------------------------------------------------

## Delete Registered Model Tag {#mlflowModelRegistryServicedeleteRegisteredModelTag}

<table style="width:83%;">
<colgroup>
<col style="width: 63%" />
<col style="width: 19%" />
</colgroup>
<thead>
<tr class="header">
<th><blockquote>
<p>Endpoint</p>
</blockquote></th>
<th>HTTP Method</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td><code>2.0/mlflow/registered-models/delete-tag</code></td>
<td><code>DELETE</code></td>
</tr>
</tbody>
</table>

### Request Structure {#mlflowDeleteRegisteredModelTag}

<table style="width:99%;">
<colgroup>
<col style="width: 9%" />
<col style="width: 9%" />
<col style="width: 81%" />
</colgroup>
<thead>
<tr class="header">
<th>Field Name</th>
<th><blockquote>
<p>Type</p>
</blockquote></th>
<th><blockquote>
<p>Description</p>
</blockquote></th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>name</td>
<td><code>STRING</code></td>
<td>Name of the registered model that the tag was logged under. This
field is required.</td>
</tr>
<tr class="even">
<td>key</td>
<td><code>STRING</code></td>
<td>Name of the tag. The name must be an exact match; wild-card deletion
is not supported. Maximum size is 250 bytes. This field is
required.</td>
</tr>
</tbody>
</table>

------------------------------------------------------------------------

## Delete Model Version Tag {#mlflowModelRegistryServicedeleteModelVersionTag}

<table style="width:79%;">
<colgroup>
<col style="width: 59%" />
<col style="width: 19%" />
</colgroup>
<thead>
<tr class="header">
<th><blockquote>
<p>Endpoint</p>
</blockquote></th>
<th>HTTP Method</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td><code>2.0/mlflow/model-versions/delete-tag</code></td>
<td><code>DELETE</code></td>
</tr>
</tbody>
</table>

### Request Structure {#mlflowDeleteModelVersionTag}

<table style="width:99%;">
<colgroup>
<col style="width: 9%" />
<col style="width: 9%" />
<col style="width: 81%" />
</colgroup>
<thead>
<tr class="header">
<th>Field Name</th>
<th><blockquote>
<p>Type</p>
</blockquote></th>
<th><blockquote>
<p>Description</p>
</blockquote></th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>name</td>
<td><code>STRING</code></td>
<td>Name of the registered model that the tag was logged under. This
field is required.</td>
</tr>
<tr class="even">
<td>version</td>
<td><code>STRING</code></td>
<td>Model version number that the tag was logged under. This field is
required.</td>
</tr>
<tr class="odd">
<td>key</td>
<td><code>STRING</code></td>
<td>Name of the tag. The name must be an exact match; wild-card deletion
is not supported. Maximum size is 250 bytes. This field is
required.</td>
</tr>
</tbody>
</table>

------------------------------------------------------------------------

## Delete Registered Model Alias {#mlflowModelRegistryServicedeleteRegisteredModelAlias}

<table style="width:76%;">
<colgroup>
<col style="width: 56%" />
<col style="width: 19%" />
</colgroup>
<thead>
<tr class="header">
<th><blockquote>
<p>Endpoint</p>
</blockquote></th>
<th>HTTP Method</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td><code>2.0/mlflow/registered-models/alias</code></td>
<td><code>DELETE</code></td>
</tr>
</tbody>
</table>

### Request Structure {#mlflowDeleteRegisteredModelAlias}

<table style="width:99%;">
<colgroup>
<col style="width: 8%" />
<col style="width: 8%" />
<col style="width: 81%" />
</colgroup>
<thead>
<tr class="header">
<th>Field Name</th>
<th><blockquote>
<p>Type</p>
</blockquote></th>
<th><blockquote>
<p>Description</p>
</blockquote></th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>name</td>
<td><code>STRING</code></td>
<td>Name of the registered model. This field is required.</td>
</tr>
<tr class="even">
<td>alias</td>
<td><code>STRING</code></td>
<td>Name of the alias. The name must be an exact match; wild-card
deletion is not supported. Maximum size is 256 bytes. This field is
required.</td>
</tr>
</tbody>
</table>

------------------------------------------------------------------------

## Get Model Version by Alias {#mlflowModelRegistryServicegetModelVersionByAlias}

<table style="width:76%;">
<colgroup>
<col style="width: 56%" />
<col style="width: 19%" />
</colgroup>
<thead>
<tr class="header">
<th><blockquote>
<p>Endpoint</p>
</blockquote></th>
<th>HTTP Method</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td><code>2.0/mlflow/registered-models/alias</code></td>
<td><code>GET</code></td>
</tr>
</tbody>
</table>

### Request Structure {#mlflowGetModelVersionByAlias}

<table style="width:99%;">
<colgroup>
<col style="width: 17%" />
<col style="width: 17%" />
<col style="width: 64%" />
</colgroup>
<thead>
<tr class="header">
<th>Field Name</th>
<th><blockquote>
<p>Type</p>
</blockquote></th>
<th><blockquote>
<p>Description</p>
</blockquote></th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>name</td>
<td><code>STRING</code></td>
<td>Name of the registered model. This field is required.</td>
</tr>
<tr class="even">
<td>alias</td>
<td><code>STRING</code></td>
<td>Name of the alias. Maximum size is 256 bytes. This field is
required.</td>
</tr>
</tbody>
</table>

### Response Structure {#mlflowGetModelVersionByAliasResponse}

<table style="width:81%;">
<colgroup>
<col style="width: 22%" />
<col style="width: 38%" />
<col style="width: 19%" />
</colgroup>
<thead>
<tr class="header">
<th><blockquote>
<p>Field Name</p>
</blockquote></th>
<th><blockquote>
<p>Type</p>
</blockquote></th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>model_version</td>
<td><code class="interpreted-text"
role="ref">mlflowmodelversion</code></td>
<td></td>
</tr>
</tbody>
</table>

------------------------------------------------------------------------

## Set Registered Model Alias {#mlflowModelRegistryServicesetRegisteredModelAlias}

<table style="width:76%;">
<colgroup>
<col style="width: 56%" />
<col style="width: 19%" />
</colgroup>
<thead>
<tr class="header">
<th><blockquote>
<p>Endpoint</p>
</blockquote></th>
<th>HTTP Method</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td><code>2.0/mlflow/registered-models/alias</code></td>
<td><code>POST</code></td>
</tr>
</tbody>
</table>

### Request Structure {#mlflowSetRegisteredModelAlias}

<table style="width:99%;">
<colgroup>
<col style="width: 9%" />
<col style="width: 9%" />
<col style="width: 80%" />
</colgroup>
<thead>
<tr class="header">
<th>Field Name</th>
<th><blockquote>
<p>Type</p>
</blockquote></th>
<th><blockquote>
<p>Description</p>
</blockquote></th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>name</td>
<td><code>STRING</code></td>
<td>Name of the registered model. This field is required.</td>
</tr>
<tr class="even">
<td>alias</td>
<td><code>STRING</code></td>
<td>Name of the alias. Maximum size depends on storage backend. If an
alias with this name already exists, its preexisting value will be
replaced by the specified `version`. All
storage backends are guaranteed to support alias name values up to 256
bytes in size. This field is required.</td>
</tr>
<tr class="odd">
<td>version</td>
<td><code>STRING</code></td>
<td>Model version number. This field is required.</td>
</tr>
</tbody>
</table>

## Data Structures {#RESTadd}

### Dataset {#mlflowDataset}

<div class="note" markdown="1">

<div class="title" markdown="1">

Note

</div>

Experimental: This API may change or be removed in a future release
without warning.

</div>

Dataset. Represents a reference to data used for training, testing, or
evaluation during the model development process.

<table style="width:99%;">
<colgroup>
<col style="width: 11%" />
<col style="width: 10%" />
<col style="width: 77%" />
</colgroup>
<thead>
<tr class="header">
<th>Field Name</th>
<th><blockquote>
<p>Type</p>
</blockquote></th>
<th><blockquote>
<p>Description</p>
</blockquote></th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>name</td>
<td><code>STRING</code></td>
<td>The name of the dataset. E.g. ?my.<a
href="mailto:uc.table@2">uc.table@2</a>? ?nyc-taxi-dataset?,
?fantastic-elk-3? This field is required.</td>
</tr>
<tr class="even">
<td>digest</td>
<td><code>STRING</code></td>
<td>Dataset digest, e.g. an md5 hash of the dataset that uniquely
identifies it within datasets of the same name. This field is
required.</td>
</tr>
<tr class="odd">
<td>source_type</td>
<td><code>STRING</code></td>
<td>Source information for the dataset. Note that the source may not
exactly reproduce the dataset if it was transformed / modified before
use with MLflow. This field is required.</td>
</tr>
<tr class="even">
<td>source</td>
<td><code>STRING</code></td>
<td>The type of the dataset source, e.g. ?databricks-uc-table?, ?DBFS?,
?S3?, ... This field is required.</td>
</tr>
<tr class="odd">
<td>schema</td>
<td><code>STRING</code></td>
<td>The schema of the dataset. E.g., MLflow ColSpec JSON for a
dataframe, MLflow TensorSpec JSON for an ndarray, or another schema
format.</td>
</tr>
<tr class="even">
<td>profile</td>
<td><code>STRING</code></td>
<td>The profile of the dataset. Summary statistics for the dataset, such
as the number of rows in a table, the mean / std / mode of each column
in a table, or the number of elements in an array.</td>
</tr>
</tbody>
</table>

### DatasetInput {#mlflowDatasetInput}

<div class="note" markdown="1">

<div class="title" markdown="1">

Note

</div>

Experimental: This API may change or be removed in a future release
without warning.

</div>

DatasetInput. Represents a dataset and input tags.

<table style="width:99%;">
<colgroup>
<col style="width: 9%" />
<col style="width: 27%" />
<col style="width: 62%" />
</colgroup>
<thead>
<tr class="header">
<th>Field Name</th>
<th><blockquote>
<p>Type</p>
</blockquote></th>
<th><blockquote>
<p>Description</p>
</blockquote></th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>tags</td>
<td>An array of <code class="interpreted-text"
role="ref">mlflowinputtag</code></td>
<td>A list of tags for the dataset input, e.g. a ?context? tag with
value ?training?</td>
</tr>
<tr class="even">
<td>dataset</td>
<td><code class="interpreted-text" role="ref">mlflowdataset</code></td>
<td>The dataset being used as a Run input. This field is required.</td>
</tr>
</tbody>
</table>

### Experiment {#mlflowExperiment}

Experiment

<table style="width:99%;">
<colgroup>
<col style="width: 15%" />
<col style="width: 31%" />
<col style="width: 52%" />
</colgroup>
<thead>
<tr class="header">
<th><blockquote>
<p>Field Name</p>
</blockquote></th>
<th><blockquote>
<p>Type</p>
</blockquote></th>
<th><blockquote>
<p>Description</p>
</blockquote></th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>experiment_id</td>
<td><code>STRING</code></td>
<td>Unique identifier for the experiment.</td>
</tr>
<tr class="even">
<td>name</td>
<td><code>STRING</code></td>
<td>Human readable name that identifies the experiment.</td>
</tr>
<tr class="odd">
<td>artifact_location</td>
<td><code>STRING</code></td>
<td>Location where artifacts for the experiment are stored.</td>
</tr>
<tr class="even">
<td>lifecycle_stage</td>
<td><code>STRING</code></td>
<td>Current life cycle stage of the experiment: "active" or "deleted".
Deleted experiments are not returned by APIs.</td>
</tr>
<tr class="odd">
<td>last_update_time</td>
<td><code>INT64</code></td>
<td>Last update time</td>
</tr>
<tr class="even">
<td>creation_time</td>
<td><code>INT64</code></td>
<td>Creation time</td>
</tr>
<tr class="odd">
<td>tags</td>
<td>An array of <code class="interpreted-text"
role="ref">mlflowexperimenttag</code></td>
<td>Tags: Additional metadata key-value pairs.</td>
</tr>
</tbody>
</table>

### ExperimentTag {#mlflowExperimentTag}

Tag for an experiment.

<table style="width:60%;">
<colgroup>
<col style="width: 18%" />
<col style="width: 18%" />
<col style="width: 23%" />
</colgroup>
<thead>
<tr class="header">
<th>Field Name</th>
<th><blockquote>
<p>Type</p>
</blockquote></th>
<th><blockquote>
<p>Description</p>
</blockquote></th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>key</td>
<td><code>STRING</code></td>
<td>The tag key.</td>
</tr>
<tr class="even">
<td>value</td>
<td><code>STRING</code></td>
<td>The tag value.</td>
</tr>
</tbody>
</table>

### FileInfo {#mlflowFileInfo}

<table style="width:99%;">
<colgroup>
<col style="width: 16%" />
<col style="width: 16%" />
<col style="width: 65%" />
</colgroup>
<thead>
<tr class="header">
<th>Field Name</th>
<th><blockquote>
<p>Type</p>
</blockquote></th>
<th><blockquote>
<p>Description</p>
</blockquote></th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>path</td>
<td><code>STRING</code></td>
<td>Path relative to the root artifact directory run.</td>
</tr>
<tr class="even">
<td>is_dir</td>
<td><code>BOOL</code></td>
<td>Whether the path is a directory.</td>
</tr>
<tr class="odd">
<td>file_size</td>
<td><code>INT64</code></td>
<td>Size in bytes. Unset for directories.</td>
</tr>
</tbody>
</table>

### InputTag {#mlflowInputTag}

<div class="note" markdown="1">

<div class="title" markdown="1">

Note

</div>

Experimental: This API may change or be removed in a future release
without warning.

</div>

Tag for an input.

<table style="width:72%;">
<colgroup>
<col style="width: 18%" />
<col style="width: 18%" />
<col style="width: 36%" />
</colgroup>
<thead>
<tr class="header">
<th>Field Name</th>
<th><blockquote>
<p>Type</p>
</blockquote></th>
<th><blockquote>
<p>Description</p>
</blockquote></th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>key</td>
<td><code>STRING</code></td>
<td>The tag key. This field is required.</td>
</tr>
<tr class="even">
<td>value</td>
<td><code>STRING</code></td>
<td>The tag value. This field is required.</td>
</tr>
</tbody>
</table>

### Metric {#mlflowMetric}

Metric associated with a run, represented as a key-value pair.

<table style="width:99%;">
<colgroup>
<col style="width: 16%" />
<col style="width: 16%" />
<col style="width: 65%" />
</colgroup>
<thead>
<tr class="header">
<th>Field Name</th>
<th><blockquote>
<p>Type</p>
</blockquote></th>
<th><blockquote>
<p>Description</p>
</blockquote></th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>key</td>
<td><code>STRING</code></td>
<td>Key identifying this metric.</td>
</tr>
<tr class="even">
<td>value</td>
<td><code>DOUBLE</code></td>
<td>Value associated with this metric.</td>
</tr>
<tr class="odd">
<td>timestamp</td>
<td><code>INT64</code></td>
<td>The timestamp at which this metric was recorded.</td>
</tr>
<tr class="even">
<td>step</td>
<td><code>INT64</code></td>
<td>Step at which to log the metric.</td>
</tr>
</tbody>
</table>

### ModelVersion {#mlflowModelVersion}

<table style="width:99%;">
<colgroup>
<col style="width: 13%" />
<col style="width: 23%" />
<col style="width: 62%" />
</colgroup>
<thead>
<tr class="header">
<th><blockquote>
<p>Field Name</p>
</blockquote></th>
<th><blockquote>
<p>Type</p>
</blockquote></th>
<th><blockquote>
<p>Description</p>
</blockquote></th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>name</td>
<td><code>STRING</code></td>
<td>Unique name of the model</td>
</tr>
<tr class="even">
<td>version</td>
<td><code>STRING</code></td>
<td>Model's version number.</td>
</tr>
<tr class="odd">
<td>creation_timestamp</td>
<td><code>INT64</code></td>
<td>Timestamp recorded when this <code>model_version</code> was
created.</td>
</tr>
<tr class="even">
<td>last_updated_timestamp</td>
<td><code>INT64</code></td>
<td>Timestamp recorded when metadata for this <code>model_version</code>
was last updated.</td>
</tr>
<tr class="odd">
<td>user_id</td>
<td><code>STRING</code></td>
<td>User that created this <code>model_version</code>.</td>
</tr>
<tr class="even">
<td>current_stage</td>
<td><code>STRING</code></td>
<td>Current stage for this <code>model_version</code>.</td>
</tr>
<tr class="odd">
<td>description</td>
<td><code>STRING</code></td>
<td>Description of this <code>model_version</code>.</td>
</tr>
<tr class="even">
<td>source</td>
<td><code>STRING</code></td>
<td>URI indicating the location of the source model artifacts, used when
creating <code>model_version</code></td>
</tr>
<tr class="odd">
<td>run_id</td>
<td><code>STRING</code></td>
<td>MLflow run ID used when creating <code>model_version</code>, if
<code>source</code> was generated by an experiment run stored in MLflow
tracking server.</td>
</tr>
<tr class="even">
<td>status</td>
<td><code class="interpreted-text"
role="ref">mlflowmodelversionstatus</code></td>
<td>Current status of <code>model_version</code></td>
</tr>
<tr class="odd">
<td>status_message</td>
<td><code>STRING</code></td>
<td>Details on current <code>status</code>, if it is pending or
failed.</td>
</tr>
<tr class="even">
<td>tags</td>
<td>An array of <code class="interpreted-text"
role="ref">mlflowmodelversiontag</code></td>
<td>Tags: Additional metadata key-value pairs for this
<code>model_version</code>.</td>
</tr>
<tr class="odd">
<td>run_link</td>
<td><code>STRING</code></td>
<td>Run Link: Direct link to the run that generated this version. This
field is set at model version creation time only for model versions
whose source run is from a tracking server that is different from the
registry server.</td>
</tr>
<tr class="even">
<td>aliases</td>
<td>An array of <code>STRING</code></td>
<td>Aliases pointing to this <code>model_version</code>.</td>
</tr>
</tbody>
</table>

### ModelVersionTag {#mlflowModelVersionTag}

Tag for a model version.

<table style="width:60%;">
<colgroup>
<col style="width: 18%" />
<col style="width: 18%" />
<col style="width: 23%" />
</colgroup>
<thead>
<tr class="header">
<th>Field Name</th>
<th><blockquote>
<p>Type</p>
</blockquote></th>
<th><blockquote>
<p>Description</p>
</blockquote></th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>key</td>
<td><code>STRING</code></td>
<td>The tag key.</td>
</tr>
<tr class="even">
<td>value</td>
<td><code>STRING</code></td>
<td>The tag value.</td>
</tr>
</tbody>
</table>

### Param {#mlflowParam}

Param associated with a run.

<table style="width:86%;">
<colgroup>
<col style="width: 18%" />
<col style="width: 18%" />
<col style="width: 50%" />
</colgroup>
<thead>
<tr class="header">
<th>Field Name</th>
<th><blockquote>
<p>Type</p>
</blockquote></th>
<th><blockquote>
<p>Description</p>
</blockquote></th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>key</td>
<td><code>STRING</code></td>
<td>Key identifying this param.</td>
</tr>
<tr class="even">
<td>value</td>
<td><code>STRING</code></td>
<td>Value associated with this param.</td>
</tr>
</tbody>
</table>

### RegisteredModel {#mlflowRegisteredModel}

<table style="width:99%;">
<colgroup>
<col style="width: 15%" />
<col style="width: 30%" />
<col style="width: 52%" />
</colgroup>
<thead>
<tr class="header">
<th><blockquote>
<p>Field Name</p>
</blockquote></th>
<th><blockquote>
<p>Type</p>
</blockquote></th>
<th><blockquote>
<p>Description</p>
</blockquote></th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>name</td>
<td><code>STRING</code></td>
<td>Unique name for the model.</td>
</tr>
<tr class="even">
<td>creation_timestamp</td>
<td><code>INT64</code></td>
<td>Timestamp recorded when this <code>registered_model</code> was
created.</td>
</tr>
<tr class="odd">
<td>last_updated_timestamp</td>
<td><code>INT64</code></td>
<td>Timestamp recorded when metadata for this
<code>registered_model</code> was last updated.</td>
</tr>
<tr class="even">
<td>user_id</td>
<td><code>STRING</code></td>
<td>User that created this <code>registered_model</code> NOTE: this
field is not currently returned.</td>
</tr>
<tr class="odd">
<td>description</td>
<td><code>STRING</code></td>
<td>Description of this <code>registered_model</code>.</td>
</tr>
<tr class="even">
<td>latest_versions</td>
<td>An array of <code class="interpreted-text"
role="ref">mlflowmodelversion</code></td>
<td>Collection of latest model versions for each stage. Only contains
models with current <code>READY</code> status.</td>
</tr>
<tr class="odd">
<td>tags</td>
<td>An array of <code class="interpreted-text"
role="ref">mlflowregisteredmodeltag</code></td>
<td>Tags: Additional metadata key-value pairs for this
<code>registered_model</code>.</td>
</tr>
<tr class="even">
<td>aliases</td>
<td>An array of <code class="interpreted-text"
role="ref">mlflowregisteredmodelalias</code></td>
<td>Aliases pointing to model versions associated with this
<code>registered_model</code>.</td>
</tr>
</tbody>
</table>

### RegisteredModelAlias {#mlflowRegisteredModelAlias}

Alias for a registered model

<table style="width:99%;">
<colgroup>
<col style="width: 16%" />
<col style="width: 16%" />
<col style="width: 66%" />
</colgroup>
<thead>
<tr class="header">
<th>Field Name</th>
<th><blockquote>
<p>Type</p>
</blockquote></th>
<th><blockquote>
<p>Description</p>
</blockquote></th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>alias</td>
<td><code>STRING</code></td>
<td>The name of the alias.</td>
</tr>
<tr class="even">
<td>version</td>
<td><code>STRING</code></td>
<td>The model version number that the alias points to.</td>
</tr>
</tbody>
</table>

### RegisteredModelTag {#mlflowRegisteredModelTag}

Tag for a registered model

<table style="width:60%;">
<colgroup>
<col style="width: 18%" />
<col style="width: 18%" />
<col style="width: 23%" />
</colgroup>
<thead>
<tr class="header">
<th>Field Name</th>
<th><blockquote>
<p>Type</p>
</blockquote></th>
<th><blockquote>
<p>Description</p>
</blockquote></th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>key</td>
<td><code>STRING</code></td>
<td>The tag key.</td>
</tr>
<tr class="even">
<td>value</td>
<td><code>STRING</code></td>
<td>The tag value.</td>
</tr>
</tbody>
</table>

### Run {#mlflowRun}

A single run.

<table style="width:75%;">
<colgroup>
<col style="width: 18%" />
<col style="width: 34%" />
<col style="width: 22%" />
</colgroup>
<thead>
<tr class="header">
<th>Field Name</th>
<th><blockquote>
<p>Type</p>
</blockquote></th>
<th><blockquote>
<p>Description</p>
</blockquote></th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>info</td>
<td><code class="interpreted-text" role="ref">mlflowruninfo</code></td>
<td>Run metadata.</td>
</tr>
<tr class="even">
<td>data</td>
<td><code class="interpreted-text" role="ref">mlflowrundata</code></td>
<td>Run data.</td>
</tr>
<tr class="odd">
<td>inputs</td>
<td><code class="interpreted-text"
role="ref">mlflowruninputs</code></td>
<td>Run inputs.</td>
</tr>
</tbody>
</table>

### RunData {#mlflowRunData}

Run data (metrics, params, and tags).

<table style="width:99%;">
<colgroup>
<col style="width: 14%" />
<col style="width: 39%" />
<col style="width: 44%" />
</colgroup>
<thead>
<tr class="header">
<th>Field Name</th>
<th><blockquote>
<p>Type</p>
</blockquote></th>
<th><blockquote>
<p>Description</p>
</blockquote></th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>metrics</td>
<td>An array of <code class="interpreted-text"
role="ref">mlflowmetric</code></td>
<td>Run metrics.</td>
</tr>
<tr class="even">
<td>params</td>
<td>An array of <code class="interpreted-text"
role="ref">mlflowparam</code></td>
<td>Run parameters.</td>
</tr>
<tr class="odd">
<td>tags</td>
<td>An array of <code class="interpreted-text"
role="ref">mlflowruntag</code></td>
<td>Additional metadata key-value pairs.</td>
</tr>
</tbody>
</table>

### RunInfo {#mlflowRunInfo}

Metadata of a single run.

<table style="width:99%;">
<colgroup>
<col style="width: 14%" />
<col style="width: 19%" />
<col style="width: 65%" />
</colgroup>
<thead>
<tr class="header">
<th><blockquote>
<p>Field Name</p>
</blockquote></th>
<th><blockquote>
<p>Type</p>
</blockquote></th>
<th><blockquote>
<p>Description</p>
</blockquote></th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>run_id</td>
<td><code>STRING</code></td>
<td>Unique identifier for the run.</td>
</tr>
<tr class="even">
<td>run_uuid</td>
<td><code>STRING</code></td>
<td>[Deprecated, use run_id instead] Unique identifier for the run. This
field will be removed in a future MLflow version.</td>
</tr>
<tr class="odd">
<td>run_name</td>
<td><code>STRING</code></td>
<td>The name of the run.</td>
</tr>
<tr class="even">
<td>experiment_id</td>
<td><code>STRING</code></td>
<td>The experiment ID.</td>
</tr>
<tr class="odd">
<td>user_id</td>
<td><code>STRING</code></td>
<td>User who initiated the run. This field is deprecated as of MLflow
1.0, and will be removed in a future MLflow release. Use 'mlflow.user'
tag instead.</td>
</tr>
<tr class="even">
<td>status</td>
<td><code class="interpreted-text"
role="ref">mlflowrunstatus</code></td>
<td>Current status of the run.</td>
</tr>
<tr class="odd">
<td>start_time</td>
<td><code>INT64</code></td>
<td>Unix timestamp of when the run started in milliseconds.</td>
</tr>
<tr class="even">
<td>end_time</td>
<td><code>INT64</code></td>
<td>Unix timestamp of when the run ended in milliseconds.</td>
</tr>
<tr class="odd">
<td>artifact_uri</td>
<td><code>STRING</code></td>
<td>URI of the directory where artifacts should be uploaded. This can be
a local path (starting with "/"), or a distributed file system (DFS)
path, like <code>s3://bucket/directory</code> or
<code>dbfs:/my/directory</code>. If not set, the local
<code>./mlruns</code> directory is chosen.</td>
</tr>
<tr class="even">
<td>lifecycle_stage</td>
<td><code>STRING</code></td>
<td>Current life cycle stage of the experiment : OneOf("active",
"deleted")</td>
</tr>
</tbody>
</table>

### RunInputs {#mlflowRunInputs}

<div class="note" markdown="1">

<div class="title" markdown="1">

Note

</div>

Experimental: This API may change or be removed in a future release
without warning.

</div>

Run inputs.

<table style="width:99%;">
<colgroup>
<col style="width: 19%" />
<col style="width: 45%" />
<col style="width: 33%" />
</colgroup>
<thead>
<tr class="header">
<th><blockquote>
<p>Field Name</p>
</blockquote></th>
<th><blockquote>
<p>Type</p>
</blockquote></th>
<th><blockquote>
<p>Description</p>
</blockquote></th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>dataset_inputs</td>
<td>An array of <code class="interpreted-text"
role="ref">mlflowdatasetinput</code></td>
<td>Dataset inputs to the Run.</td>
</tr>
</tbody>
</table>

### RunTag {#mlflowRunTag}

Tag for a run.

<table style="width:60%;">
<colgroup>
<col style="width: 18%" />
<col style="width: 18%" />
<col style="width: 23%" />
</colgroup>
<thead>
<tr class="header">
<th>Field Name</th>
<th><blockquote>
<p>Type</p>
</blockquote></th>
<th><blockquote>
<p>Description</p>
</blockquote></th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>key</td>
<td><code>STRING</code></td>
<td>The tag key.</td>
</tr>
<tr class="even">
<td>value</td>
<td><code>STRING</code></td>
<td>The tag value.</td>
</tr>
</tbody>
</table>

### ModelVersionStatus {#mlflowModelVersionStatus}

<table>
<colgroup>
<col style="width: 20%" />
<col style="width: 79%" />
</colgroup>
<thead>
<tr class="header">
<th><blockquote>
<p>Name</p>
</blockquote></th>
<th><blockquote>
<p>Description</p>
</blockquote></th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>PENDING_REGISTRATION</td>
<td>Request to register a new model version is pending as server
performs background tasks.</td>
</tr>
<tr class="even">
<td>FAILED_REGISTRATION</td>
<td>Request to register a new model version has failed.</td>
</tr>
<tr class="odd">
<td>READY</td>
<td>Model version is ready for use.</td>
</tr>
</tbody>
</table>

### RunStatus {#mlflowRunStatus}

Status of a run.

<table style="width:76%;">
<colgroup>
<col style="width: 16%" />
<col style="width: 59%" />
</colgroup>
<thead>
<tr class="header">
<th><blockquote>
<p>Name</p>
</blockquote></th>
<th><blockquote>
<p>Description</p>
</blockquote></th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>RUNNING</td>
<td>Run has been initiated.</td>
</tr>
<tr class="even">
<td>SCHEDULED</td>
<td>Run is scheduled to run at a later time.</td>
</tr>
<tr class="odd">
<td>FINISHED</td>
<td>Run has completed.</td>
</tr>
<tr class="even">
<td>FAILED</td>
<td>Run execution failed.</td>
</tr>
<tr class="odd">
<td>KILLED</td>
<td>Run killed by user.</td>
</tr>
</tbody>
</table>

### ViewType {#mlflowViewType}

View type for ListExperiments query.

<table style="width:81%;">
<colgroup>
<col style="width: 20%" />
<col style="width: 59%" />
</colgroup>
<thead>
<tr class="header">
<th><blockquote>
<p>Name</p>
</blockquote></th>
<th><blockquote>
<p>Description</p>
</blockquote></th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>ACTIVE_ONLY</td>
<td>Default. Return only active experiments.</td>
</tr>
<tr class="even">
<td>DELETED_ONLY</td>
<td>Return only deleted experiments.</td>
</tr>
<tr class="odd">
<td>ALL</td>
<td>Get all experiments.</td>
</tr>
</tbody>
</table>
