# MLflow Tracking {#tracking}

The MLflow Tracking component is an API and UI for logging parameters,
code versions, metrics, and output files when running your machine
learning code and for later visualizing the results. MLflow Tracking
lets you log and query experiments using `Python <python-api>`,
`REST <rest-api>`, `R-api`, and `java_api` APIs.

<div class="contents" markdown="1" local="" depth="2">

Table of Contents

</div>

## Concepts {#tracking-concepts}

MLflow Tracking is organized around the concept of *runs*, which are
executions of some piece of data science code. Each run records the
following information:

Code Version

:   Git commit hash used for the run, if it was run from an
    `MLflow Project <projects>`.

Start & End Time

:   Start and end time of the run

Source

:   Name of the file to launch the run, or the project name and entry
    point for the run if run from an `MLflow Project <projects>`.

Parameters

:   Key-value input parameters of your choice. Both keys and values are
    strings.

Metrics

:   Key-value metrics, where the value is numeric. Each metric can be
    updated throughout the course of the run (for example, to track how
    your model's loss function is converging), and MLflow records and
    lets you visualize the metric's full history.

Artifacts

:   Output files in any format. For example, you can record images (for
    example, PNGs), models (for example, a pickled scikit-learn model),
    and data files (for example, a
    [Parquet](https://parquet.apache.org/) file) as artifacts.

You can record runs using MLflow Python, R, Java, and REST APIs from
anywhere you run your code. For example, you can record them in a
standalone program, on a remote cloud machine, or in an interactive
notebook. If you record runs in an `MLflow Project <projects>`, MLflow
remembers the project URI and source version.

You can optionally organize runs into *experiments*, which group
together runs for a specific task. You can create an experiment using
the `mlflow experiments` CLI, with `mlflow.create_experiment`, or using
the corresponding REST parameters. The MLflow API and UI let you create
and search for experiments.

Once your runs have been recorded, you can query them using the
`tracking_ui` or the MLflow API.

## Where Runs Are Recorded {#where_runs_are_recorded}

MLflow runs can be recorded to local files, to a SQLAlchemy-compatible
database, or remotely to a tracking server. By default, the MLflow
Python API logs runs locally to files in an `mlruns` directory wherever
you ran your program. You can then run `mlflow ui` to see the logged
runs.

To log runs remotely, set the `MLFLOW_TRACKING_URI` environment variable
to a tracking server's URI or call `mlflow.set_tracking_uri`.

There are different kinds of remote tracking URIs:

-   Local file path (specified as `file:/my/local/dir`), where data is
    just directly stored locally.
-   Database encoded as
    `<dialect>+<driver>://<username>:<password>@<host>:<port>/<database>`.
    MLflow supports the dialects `mysql`, `mssql`, `sqlite`, and
    `postgresql`. For more details, see [SQLAlchemy database
    uri](https://docs.sqlalchemy.org/en/latest/core/engines.html#database-urls).
-   HTTP server (specified as `https://my-server:5000`), which is a
    server hosting an `MLflow tracking server <tracking_server>`.
-   Databricks workspace (specified as `databricks` or as
    `databricks://<profileName>`, a [Databricks CLI
    profile](https://github.com/databricks/databricks-cli#installation).
    Refer to Access the MLflow tracking server from outside Databricks
    [\[AWS\]](http://docs.databricks.com/applications/mlflow/access-hosted-tracking-server.html)
    [\[Azure\]](http://docs.microsoft.com/azure/databricks/applications/mlflow/access-hosted-tracking-server),
    or `the quickstart <quickstart_tracking_server>` to easily get
    started with hosted MLflow on Databricks Community Edition.

## How runs and artifacts are recorded {#how-runs-and-artifacts-are-recorded}

As mentioned above, MLflow runs can be recorded to local files, to a
SQLAlchemy-compatible database, or remotely to a tracking server. MLflow
artifacts can be persisted to local files and a variety of remote file
storage solutions. For storing runs and artifacts, MLflow uses two
components for
[storage](https://mlflow.org/docs/latest/tracking.html#storage): backend
store and artifact store. While the backend store persists MLflow
entities (runs, parameters, metrics, tags, notes, metadata, etc), the
artifact store persists artifacts (files, models, images, in-memory
objects, or model summary, etc).

The MLflow server can be configured with an artifacts HTTP proxy,
passing artifact requests through the tracking server to store and
retrieve artifacts without having to interact with underlying object
store services. Usage of the proxied artifact access feature is
described in Scenarios 5 and 6 below.

The MLflow client can interface with a variety of
[backend](https://mlflow.org/docs/latest/tracking.html#backend-stores)
and
[artifact](https://mlflow.org/docs/latest/tracking.html#artifact-stores)
storage configurations. Here are four common configuration scenarios:

### Scenario 1: MLflow on localhost {#scenario-1-mlflow-on-localhost}

Many developers run MLflow on their local machine, where both the
backend and artifact store share a directory on the local
filesystem—`./mlruns`—as shown in the diagram. The MLflow client
directly interfaces with an instance of a
`FileStore` and
`LocalArtifactRepository`.

<figure>
<img src="../static/images/scenario_1.png" class="align-center"
alt="../static/images/scenario_1.png" />
</figure>

In this simple scenario, the MLflow client uses the following interfaces
to record MLflow entities and artifacts:

> -   An instance of a
>     `LocalArtifactRepository` (to store
>     artifacts)
> -   An instance of a `FileStore` (to save
>     MLflow entities)

### Scenario 2: MLflow on localhost with SQLite {#scenario-2-mlflow-on-localhost-with-sqlite}

Many users also run MLflow on their local machines with a
[SQLAlchemy-compatible](https://docs.sqlalchemy.org/en/14/core/engines.html#database-urls)
database: [SQLite](https://sqlite.org/docs.html). In this case,
artifacts are stored under the local `./mlruns` directory, and MLflow
entities are inserted in a SQLite database file `mlruns.db`.

<figure>
<img src="../static/images/scenario_2.png" class="align-center"
alt="../static/images/scenario_2.png" />
</figure>

In this scenario, the MLflow client uses the following interfaces to
record MLflow entities and artifacts:

> -   An instance of a
>     `LocalArtifactRepository` (to save
>     artifacts)
> -   An instance of an `SQLAlchemyStore`
>     (to store MLflow entities to a SQLite file `mlruns.db`)

### Scenario 3: MLflow on localhost with Tracking Server {#scenario-3-mlflow-on-localhost-with-tracking-server}

Similar to scenario 1 but a tracking server is launched, listening for
REST request calls at the default port 5000. The arguments supplied to
the `mlflow server <args>` dictate what backend and artifact stores are
used. The default is local `FileStore`. For
example, if a user launched a tracking server as
`mlflow server --backend-store-uri sqlite:///mydb.sqlite`, then SQLite
would be used for backend storage instead.

As in scenario 1, MLflow uses a local
`mlruns` filesystem directory as a backend
store and artifact store. With a tracking server running, the MLflow
client interacts with the tracking server via REST requests, as shown in
the diagram.

<figure>
<img src="../static/images/scenario_3.png" class="align-center"
alt="../static/images/scenario_3.png" />
</figure>

~~~ bash
mlflow server --backend-store-uri file:///path/to/mlruns --no-serve-artifacts
~~~

To store all runs' MLflow entities, the MLflow client interacts with the
tracking server via a series of REST requests:

> -   **Part 1a and b**:
>
> > -   The MLflow client creates an instance of a
> >     `RestStore` and sends REST API
> >     requests to log MLflow entities
> > -   The Tracking Server creates an instance of a
> >     `FileStore` to save MLflow entities
> >     and writes directly to the local
> >     `mlruns` directory

For the artifacts, the MLflow client interacts with the tracking server
via a REST request:

> -   **Part 2a, b, and c**:
>     -   The MLflow client uses
>         `RestStore` to send a REST
>         request to fetch the artifact store URI location
>     -   The Tracking Server responds with an artifact store URI
>         location
>     -   The MLflow client creates an instance of a
>         `LocalArtifactRepository` and
>         saves artifacts to the local filesystem location specified by
>         the artifact store URI (a subdirectory of
>         `mlruns`)

### Scenario 4: MLflow with remote Tracking Server, backend and artifact stores {#scenario-4-mlflow-with-remote-tracking-server-backend-and-artifact-stores}

MLflow also supports distributed architectures, where the tracking
server, backend store, and artifact store reside on remote hosts. This
example scenario depicts an architecture with a remote MLflow Tracking
Server, a Postgres database for backend entity storage, and an S3 bucket
for artifact storage.

<figure>
<img src="../static/images/scenario_4.png" class="align-center"
alt="../static/images/scenario_4.png" />
</figure>

~~~ bash
mlflow server --backend-store-uri postgresql://user:password@postgres:5432/mlflowdb --default-artifact-root s3://bucket_name --host remote_host --no-serve-artifacts
~~~

To record all runs' MLflow entities, the MLflow client interacts with
the tracking server via a series of REST requests:

> -   **Part 1a and b**:
>
> > -   The MLflow client creates an instance of a
> >     `RestStore` and sends REST API
> >     requests to log MLflow entities
> > -   The Tracking Server creates an instance of an
> >     `SQLAlchemyStore` and connects to
> >     the remote host to insert MLflow entities in the database

For artifact logging, the MLflow client interacts with the remote
Tracking Server and artifact storage host:

> -   **Part 2a, b, and c**:
>
> > -   The MLflow client uses `RestStore`
> >     to send a REST request to fetch the artifact store URI location
> >     from the Tracking Server
> > -   The Tracking Server responds with an artifact store URI location
> >     (an S3 storage URI in this case)
> > -   The MLflow client creates an instance of an
> >     `S3ArtifactRepository`, connects to
> >     the remote AWS host using the [boto
> >     client](https://boto3.amazonaws.com/v1/documentation/api/latest/index.html)
> >     libraries, and uploads the artifacts to the S3 bucket URI
> >     location

The
[FileStore](https://github.com/mlflow/mlflow/blob/master/mlflow/store/tracking/file_store.py#L115),
[RestStore](https://github.com/mlflow/mlflow/blob/master/mlflow/store/tracking/rest_store.py#L39),
and
[SQLAlchemyStore](https://github.com/mlflow/mlflow/blob/master/mlflow/store/tracking/sqlalchemy_store.py#L61)
are concrete implementations of the abstract class
[AbstractStore](https://github.com/mlflow/mlflow/blob/master/mlflow/store/tracking/abstract_store.py),
and the
[LocalArtifactRepository](https://github.com/mlflow/mlflow/blob/master/mlflow/store/artifact/local_artifact_repo.py#L15)
and
[S3ArtifactRepository](https://github.com/mlflow/mlflow/blob/master/mlflow/store/artifact/s3_artifact_repo.py#L14)
are concrete implementations of the abstract class
[ArtifactRepository](https://github.com/mlflow/mlflow/blob/master/mlflow/store/artifact/artifact_repo.py#L13).

### Scenario 5: MLflow Tracking Server enabled with proxied artifact storage access {#scenario_5}

MLflow's Tracking Server supports utilizing the host as a proxy server
for operations involving artifacts. Once configured with the appropriate
access requirements, an administrator can start the tracking server to
enable assumed-role operations involving the saving, loading, or listing
of model artifacts, images, documents, and files. This eliminates the
need to allow end users to have direct path access to a remote object
store (e.g., s3, adls, gcs, hdfs) for artifact handling and eliminates
the need for an end-user to provide access credentials to interact with
an underlying object store.

<figure>
<img src="../static/images/scenario_5.png" class="align-center"
alt="../static/images/scenario_5.png" />
</figure>

~~~ bash
mlflow server \
  --backend-store-uri postgresql://user:password@postgres:5432/mlflowdb \
  # Artifact access is enabled through the proxy URI 'mlflow-artifacts:/',
  # giving users access to this location without having to manage credentials
  # or permissions.
  --artifacts-destination s3://bucket_name \
  --host remote_host
~~~

Enabling the Tracking Server to perform proxied artifact access in order
to route client artifact requests to an object store location:

> -   **Part 1a and b**:
>
> > -   The MLflow client creates an instance of a
> >     `RestStore` and sends REST API
> >     requests to log MLflow entities
> > -   The Tracking Server creates an instance of an
> >     `SQLAlchemyStore` and connects to
> >     the remote host for inserting tracking information in the
> >     database (i.e., metrics, parameters, tags, etc.)
>
> -   **Part 1c and d**:
>
> > -   Retrieval requests by the client return information from the
> >     configured `SQLAlchemyStore` table
>
> -   **Part 2a and b**:
>
> > -   Logging events for artifacts are made by the client using the
> >     `HttpArtifactRepository` to write files to MLflow Tracking
> >     Server
> > -   The Tracking Server then writes these files to the configured
> >     object store location with assumed role authentication
>
> -   **Part 2c and d**:
>
> > -   Retrieving artifacts from the configured backend store for a
> >     user request is done with the same authorized authentication
> >     that was configured at server start
> > -   Artifacts are passed to the end user through the Tracking Server
> >     through the interface of the `HttpArtifactRepository`

<div class="note" markdown="1">

<div class="title" markdown="1">

Note

</div>

When an experiment is created, the artifact storage location from the
configuration of the tracking server is logged in the experiment's
metadata. When enabling proxied artifact storage, any existing
experiments that were created while operating a tracking server in
non-proxied mode will continue to use a non-proxied artifact location.
In order to use proxied artifact logging, a new experiment must be
created. If the intention of enabling a tracking server in
`-serve-artifacts` mode is to eliminate the need for a client to have
authentication to the underlying storage, new experiments should be
created for use by clients so that the tracking server can handle
authentication after this migration.

</div>

<div class="warning" markdown="1">

<div class="title" markdown="1">

Warning

</div>

The MLflow artifact proxied access service enables users to have an
*assumed role of access to all artifacts* that are accessible to the
Tracking Server. Administrators who are enabling this feature should
ensure that the access level granted to the Tracking Server for artifact
operations meets all security requirements prior to enabling the
Tracking Server to operate in a proxied file handling role.

</div>

### Scenario 6: MLflow Tracking Server used exclusively as proxied access host for artifact storage access {#scenario_6}

MLflow's Tracking Server can be used in an exclusive artifact proxied
artifact handling role. Specifying the `--artifacts-only` flag restricts
an MLflow server instance to only serve artifact-related API requests by
proxying to an underlying object store.

<div class="note" markdown="1">

<div class="title" markdown="1">

Note

</div>

Starting a Tracking Server with the `--artifacts-only` parameter will
disable all Tracking Server functionality apart from API calls related
to saving, loading, or listing artifacts. Creating runs, logging metrics
or parameters, and accessing other attributes about experiments are all
not permitted in this mode.

</div>

<figure>
<img src="../static/images/scenario_6.png" class="align-center"
alt="../static/images/scenario_6.png" />
</figure>

~~~ bash
mlflow server --artifacts-destination s3://bucket_name --artifacts-only --host remote_host
~~~

Running an MLflow server in `--artifacts-only` mode:

> -   **Part 1a and b**:
>
> > -   The MLflow client will interact with the Tracking Server using
> >     the `HttpArtifactRepository` interface.
> > -   Listing artifacts associated with a run will be conducted from
> >     the Tracking Server using the access credentials set at server
> >     startup
> > -   Saving of artifacts will transmit the files to the Tracking
> >     Server which will then write the files to the file store using
> >     credentials set at server start.
>
> -   **Part 1c and d**:
>
> > -   Listing of artifact responses will pass from the file store
> >     through the Tracking Server to the client
> > -   Loading of artifacts will utilize the access credentials of the
> >     MLflow Tracking Server to acquire the files which are then
> >     passed on to the client

<div class="note" markdown="1">

<div class="title" markdown="1">

Note

</div>

\- If migrating from Scenario 5 to Scenario 6 due to request volumes, it
is important to perform two validations:

-   Ensure that the new tracking server that is operating in
    `--artifacts-only` mode has access permissions to the location set
    by `--artifacts-destination` that the former multi-role tracking
    server had.
-   The former multi-role tracking server that was serving artifacts
    must have the `-serve-artifacts` argument disabled.

</div>

<div class="warning" markdown="1">

<div class="title" markdown="1">

Warning

</div>

Operating the Tracking Server in proxied artifact access mode by setting
the parameter `--serve-artifacts` during server start, even in
`--artifacts-only` mode, will give access to artifacts residing on the
object store to any user that has authentication to access the Tracking
Server. Ensure that any per-user security posture that you are required
to maintain is applied accordingly to the proxied access that the
Tracking Server will have in this mode of operation.

</div>

## Logging Data to Runs {#logging-data-to-runs}

You can log data to runs using the MLflow Python, R, Java, or REST API.
This section shows the Python API.

<div class="contents" markdown="1" depth="1" local="">

In this section:

</div>

### Logging functions {#tracking_logging_functions}

`mlflow.set_tracking_uri` connects to a tracking URI. You can also set
the `MLFLOW_TRACKING_URI` environment variable to have MLflow find a URI
from there. In both cases, the URI can either be a HTTP/HTTPS URI for a
remote server, a database connection string, or a local path to log data
to a directory. The URI defaults to `mlruns`.

`mlflow.get_tracking_uri` returns the current tracking URI.

`mlflow.create_experiment` creates a new experiment and returns its ID.
Runs can be launched under the experiment by passing the experiment ID
to `mlflow.start_run`.

`mlflow.set_experiment` sets an experiment as active. If the experiment
does not exist, creates a new experiment. If you do not specify an
experiment in `mlflow.start_run`, new runs are launched under this
experiment.

`mlflow.start_run` returns the currently active run (if one exists), or
starts a new run and returns a `mlflow.ActiveRun` object usable as a
context manager for the current run. You do not need to call `start_run`
explicitly: calling one of the logging functions with no active run
automatically starts a new one.

<div class="note" markdown="1">

<div class="title" markdown="1">

Note

</div>

\- If the argument `run_name` is not set within `mlflow.start_run`, a
unique run name will be generated for each run.

</div>

`mlflow.end_run` ends the currently active run, if any, taking an
optional run status.

`mlflow.active_run` returns a `mlflow.entities.Run` object corresponding
to the currently active run, if any. **Note**: You cannot access
currently-active run attributes (parameters, metrics, etc.) through the
run returned by `mlflow.active_run`. In order to access such attributes,
use the `MlflowClient <mlflow.client.MlflowClient>` as follows:

~~~ python
client = mlflow.MlflowClient()
data = client.get_run(mlflow.active_run().info.run_id).data
~~~

`mlflow.last_active_run` returns a `mlflow.entities.Run` object
corresponding to the currently active run, if any. Otherwise, it returns
a `mlflow.entities.Run` object corresponding the last run started from
the current Python process that reached a terminal status (i.e.
FINISHED, FAILED, or KILLED).

`mlflow.get_parent_run` returns a `mlflow.entities.Run` object
corresponding to the parent run for the given run id, if one exists.
Otherwise, it returns None.

`mlflow.log_param` logs a single key-value param in the currently active
run. The key and value are both strings. Use `mlflow.log_params` to log
multiple params at once.

`mlflow.log_metric` logs a single key-value metric. The value must
always be a number. MLflow remembers the history of values for each
metric. Use `mlflow.log_metrics` to log multiple metrics at once.

`mlflow.log_input` logs a single `mlflow.data.dataset.Dataset` object
corresponding to the currently active run. You may also log a dataset
context string and a dict of key-value tags.

`mlflow.set_tag` sets a single key-value tag in the currently active
run. The key and value are both strings. Use `mlflow.set_tags` to set
multiple tags at once.

`mlflow.log_artifact` logs a local file or directory as an artifact,
optionally taking an `artifact_path` to place it in within the run's
artifact URI. Run artifacts can be organized into directories, so you
can place the artifact in a directory this way.

`mlflow.log_artifacts` logs all the files in a given directory as
artifacts, again taking an optional `artifact_path`.

`mlflow.get_artifact_uri` returns the URI that artifacts from the
current run should be logged to.

### Launching Multiple Runs in One Program {#launching-multiple-runs-in-one-program}

Sometimes you want to launch multiple MLflow runs in the same program:
for example, maybe you are performing a hyperparameter search locally or
your experiments are just very fast to run. This is easy to do because
the `ActiveRun` object returned by `mlflow.start_run` is a Python
[context manager](https://docs.python.org/2.5/whatsnew/pep-343.html).
You can "scope" each run to just one block of code as follows:

~~~ python
with mlflow.start_run():
    mlflow.log_param("x", 1)
    mlflow.log_metric("y", 2)
    ...
~~~

The run remains open throughout the `with` statement, and is
automatically closed when the statement exits, even if it exits due to
an exception.

### Performance Tracking with Metrics {#performance-tracking-with-metrics}

You log MLflow metrics with `log` methods in the Tracking API. The `log`
methods support two alternative methods for distinguishing metric values
on the x-axis: `timestamp` and `step`.

`timestamp` is an optional long value that represents the time that the
metric was logged. `timestamp` defaults to the current time. `step` is
an optional integer that represents any measurement of training progress
(number of training iterations, number of epochs, and so on). `step`
defaults to 0 and has the following requirements and properties:

-   Must be a valid 64-bit integer value.
-   Can be negative.
-   Can be out of order in successive write calls. For example, (1,
    3, 2) is a valid sequence.
-   Can have "gaps" in the sequence of values specified in successive
    write calls. For example, (1, 5, 75, -20) is a valid sequence.

If you specify both a timestamp and a step, metrics are recorded against
both axes independently.

#### Examples {#examples}

Python

:   ~~~ python
    with mlflow.start_run():
        for epoch in range(0, 3):
            mlflow.log_metric(key="quality", value=2 * epoch, step=epoch)
    ~~~

Java and Scala

:   ~~~ java
    MlflowClient client = new MlflowClient();
    RunInfo run = client.createRun();
    for (int epoch = 0; epoch < 3; epoch ++) {
        client.logMetric(run.getRunId(), "quality", 2 * epoch, System.currentTimeMillis(), epoch);
    }
    ~~~

### Visualizing Metrics {#visualizing-metrics}

Here is an example plot of the `quick start tutorial <quickstart-1>`
with the step x-axis and two timestamp axes:

<figure>
<img src="../static/images/metrics-step.png"
alt="../static/images/metrics-step.png" />
<figcaption>X-axis step</figcaption>
</figure>

<figure>
<img src="../static/images/metrics-time-wall.png"
alt="../static/images/metrics-time-wall.png" />
<figcaption>X-axis wall time - graphs the absolute time each metric was
logged</figcaption>
</figure>

<figure>
<img src="../static/images/metrics-time-relative.png"
alt="../static/images/metrics-time-relative.png" />
<figcaption>X-axis relative time - graphs the time relative to the first
metric logged, for each run</figcaption>
</figure>

## Automatic Logging {#automatic-logging}

Automatic logging allows you to log metrics, parameters, and models
without the need for explicit log statements.

There are two ways to use autologging:

1.  Call `mlflow.autolog` before your training code. This will enable
    autologging for each supported library you have installed as soon as
    you import it.
2.  Use library-specific autolog calls for each library you use in your
    code. See below for examples.

The following libraries support autologging:

<div class="contents" markdown="1" local="" depth="1">

</div>

For flavors that automatically save models as an artifact, [additional
files](https://mlflow.org/docs/latest/models.html#storage-format) for
dependency management are logged.

You can access the most recent autolog run through the
`mlflow.last_active_run` function. Here's a short sklearn autolog
example that makes use of this function:

~~~ python
import mlflow

from sklearn.model_selection import train_test_split
from sklearn.datasets import load_diabetes
from sklearn.ensemble import RandomForestRegressor

mlflow.autolog()

db = load_diabetes()
X_train, X_test, y_train, y_test = train_test_split(db.data, db.target)

# Create and train models.
rf = RandomForestRegressor(n_estimators=100, max_depth=6, max_features=3)
rf.fit(X_train, y_train)

# Use the model to make predictions on the test dataset.
predictions = rf.predict(X_test)
autolog_run = mlflow.last_active_run()
~~~

### Scikit-learn {#scikit-learn}

Call `mlflow.sklearn.autolog` before your training code to enable
automatic logging of sklearn metrics, params, and models. See example
usage
[here](https://github.com/mlflow/mlflow/tree/master/examples/sklearn_autolog).

Autologging for estimators (e.g.
[LinearRegression](https://scikit-learn.org/stable/modules/generated/sklearn.linear_model.LinearRegression.html))
and meta estimators (e.g.
[Pipeline](https://scikit-learn.org/stable/modules/generated/sklearn.pipeline.Pipeline.html))
creates a single run and logs:

<table style="width:98%;">
<colgroup>
<col style="width: 24%" />
<col style="width: 25%" />
<col style="width: 29%" />
<col style="width: 18%" />
</colgroup>
<tbody>
<tr class="odd">
<td>Metrics</td>
<td>Parameters</td>
<td>Tags</td>
<td>Artifacts</td>
</tr>
<tr class="even">
<td>Training score obtained by <code>estimator.score</code></td>
<td>Parameters obtained by <code>estimator.get_params</code></td>
<td><ul>
<li>Class name</li>
<li>Fully qualified class name</li>
</ul></td>
<td>Fitted estimator</td>
</tr>
</tbody>
</table>

Autologging for parameter search estimators (e.g.
[GridSearchCV](https://scikit-learn.org/stable/modules/generated/sklearn.model_selection.GridSearchCV.html))
creates a single parent run and nested child runs

~~~ 
- Parent run
  - Child run 1
  - Child run 2
  - ...
~~~

containing the following data:

<table style="width:98%;">
<colgroup>
<col style="width: 11%" />
<col style="width: 17%" />
<col style="width: 26%" />
<col style="width: 18%" />
<col style="width: 23%" />
</colgroup>
<tbody>
<tr class="odd">
<td>Run type</td>
<td>Metrics</td>
<td>Parameters</td>
<td>Tags</td>
<td>Artifacts</td>
</tr>
<tr class="even">
<td>Parent</td>
<td>Training score</td>
<td><ul>
<li>Parameter search estimator's parameters</li>
<li>Best parameter combination</li>
</ul></td>
<td><ul>
<li>Class name</li>
<li>Fully qualified class name</li>
</ul></td>
<td><ul>
<li>Fitted parameter search estimator</li>
<li>Fitted best estimator</li>
<li>Search results csv file</li>
</ul></td>
</tr>
<tr class="odd">
<td>Child</td>
<td>CV test score for each parameter combination</td>
<td>Each parameter combination</td>
<td><ul>
<li>Class name</li>
<li>Fully qualified class name</li>
</ul></td>
<td>--</td>
</tr>
</tbody>
</table>

### Keras {#keras}

Call `mlflow.tensorflow.autolog` before your training code to enable
automatic logging of metrics and parameters. As an example, try running
the [Keras/Tensorflow
example](https://github.com/mlflow/mlflow/blob/master/examples/keras/train.py).

Note that only `tensorflow>=2.3` are supported. The respective metrics
associated with `tf.estimator` and `EarlyStopping` are automatically
logged. As an example, try running the [Keras/TensorFlow
example](https://github.com/mlflow/mlflow/blob/master/examples/keras/train.py).

Autologging captures the following information:

|                                    |                                                                                                                        |                                                                                                                        |      |                                                                                                                                             |
|----------|-------------|------------------|----|----------------------------|
| Framework/module                   | Metrics                                                                                                                | Parameters                                                                                                             | Tags | Artifacts                                                                                                                                   |
| `tf.keras`                         | Training loss; validation loss; user-specified metrics                                                                 | `fit()` parameters; optimizer name; learning rate; epsilon                                                             | --   | Model summary on training start; [MLflow Model](https://mlflow.org/docs/latest/models.html) (Keras model); TensorBoard logs on training end |
| `tf.keras.callbacks.EarlyStopping` | Metrics from the `EarlyStopping` callbacks. For example, `stopped_epoch`, `restored_epoch`, `restore_best_weight`, etc | `fit()` parameters from `EarlyStopping`. For example, `min_delta`, `patience`, `baseline`, `restore_best_weights`, etc | --   | --                                                                                                                                          |

If no active run exists when `autolog()` captures data, MLflow will
automatically create a run to log information to. Also, MLflow will then
automatically end the run once training ends via calls to
`tf.keras.fit()`.

If a run already exists when `autolog()` captures data, MLflow will log
to that run but not automatically end that run after training.

### Gluon {#gluon}

Call `mlflow.gluon.autolog` before your training code to enable
automatic logging of metrics and parameters. See example usages with
[Gluon](https://github.com/mlflow/mlflow/tree/master/examples/gluon) .

Autologging captures the following information:

|           |                                                        |                                                          |      |                                                                                           |
|------|---------------|---------------|-----|-------------------------------|
| Framework | Metrics                                                | Parameters                                               | Tags | Artifacts                                                                                 |
| Gluon     | Training loss; validation loss; user-specified metrics | Number of layers; optimizer name; learning rate; epsilon | --   | [MLflow Model](https://mlflow.org/docs/latest/models.html) (Gluon model); on training end |

### XGBoost {#xgboost}

Call `mlflow.xgboost.autolog` before your training code to enable
automatic logging of metrics and parameters.

Autologging captures the following information:

|           |                        |                                                                                                           |      |                                                                                                                                                    |
|------|----------|------------|-------|--------------------------------------|
| Framework | Metrics                | Parameters                                                                                                | Tags | Artifacts                                                                                                                                          |
| XGBoost   | user-specified metrics | [xgboost.train](https://xgboost.readthedocs.io/en/latest/python/python_api.html#xgboost.train) parameters | --   | [MLflow Model](https://mlflow.org/docs/latest/models.html) (XGBoost model) with model signature on training end; feature importance; input example |

If early stopping is activated, metrics at the best iteration will be
logged as an extra step/iteration.

### LightGBM {#lightgbm}

Call `mlflow.lightgbm.autolog` before your training code to enable
automatic logging of metrics and parameters.

Autologging captures the following information:

|           |                        |                                                                                                                     |      |                                                                                                                                                     |
|------|----------|------------|-------|--------------------------------------|
| Framework | Metrics                | Parameters                                                                                                          | Tags | Artifacts                                                                                                                                           |
| LightGBM  | user-specified metrics | [lightgbm.train](https://lightgbm.readthedocs.io/en/latest/pythonapi/lightgbm.train.html#lightgbm-train) parameters | --   | [MLflow Model](https://mlflow.org/docs/latest/models.html) (LightGBM model) with model signature on training end; feature importance; input example |

If early stopping is activated, metrics at the best iteration will be
logged as an extra step/iteration.

### Statsmodels {#statsmodels}

Call `mlflow.statsmodels.autolog` before your training code to enable
automatic logging of metrics and parameters.

Autologging captures the following information:

|             |                        |                                                                                                                                |      |                                                                                                                                                     |
|-------|----------|-------------------|-------|-----------------------------|
| Framework   | Metrics                | Parameters                                                                                                                     | Tags | Artifacts                                                                                                                                           |
| Statsmodels | user-specified metrics | [statsmodels.base.model.Model.fit](https://www.statsmodels.org/dev/dev/generated/statsmodels.base.model.Model.html) parameters | --   | [MLflow Model](https://mlflow.org/docs/latest/models.html) (`statsmodels.base.wrapper.ResultsWrapper`) on training end |

<div class="note" markdown="1">

<div class="title" markdown="1">

Note

</div>

\- Each model subclass that overrides `fit`
expects and logs its own parameters.

</div>

### Spark {#spark}

Initialize a SparkSession with the mlflow-spark JAR attached (e.g.
`SparkSession.builder.config("spark.jars.packages", "org.mlflow.mlflow-spark")`)
and then call `mlflow.spark.autolog` to enable automatic logging of
Spark datasource information at read-time, without the need for explicit
log statements. Note that autologging of Spark ML (MLlib) models is not
yet supported.

Autologging captures the following information:

<table style="width:98%;">
<colgroup>
<col style="width: 12%" />
<col style="width: 6%" />
<col style="width: 8%" />
<col style="width: 62%" />
<col style="width: 7%" />
</colgroup>
<tbody>
<tr class="odd">
<td>Framework</td>
<td>Metrics</td>
<td>Parameters</td>
<td><blockquote>
<p>Tags</p>
</blockquote></td>
<td>Artifacts</td>
</tr>
<tr class="even">
<td>Spark</td>
<td>--</td>
<td>--</td>
<td>Single tag containing source path, version, format. The tag contains
one line per datasource</td>
<td>--</td>
</tr>
</tbody>
</table>

<div class="note" markdown="1">

<div class="title" markdown="1">

Note

</div>

\- Moreover, Spark datasource autologging occurs asynchronously - as
such, it's possible (though unlikely) to see race conditions when
launching short-lived MLflow runs that result in datasource information
not being logged.

</div>

### Fastai {#fastai}

Call `mlflow.fastai.autolog` before your training code to enable
automatic logging of metrics and parameters. See an example usage with
[Fastai](https://github.com/mlflow/mlflow/tree/master/examples/fastai).

Autologging captures the following information:

<table style="width:99%;">
<colgroup>
<col style="width: 4%" />
<col style="width: 8%" />
<col style="width: 20%" />
<col style="width: 5%" />
<col style="width: 59%" />
</colgroup>
<tbody>
<tr class="odd">
<td>Framework</td>
<td>Metrics</td>
<td>Parameters</td>
<td>Tags</td>
<td>Artifacts</td>
</tr>
<tr class="even">
<td>fastai</td>
<td>user-specified metrics</td>
<td>Logs optimizer data as parameters. For example, <code>epochs</code>,
<code>lr</code>, <code>opt_func</code>, etc; Logs the parameters of the
<a
href="https://docs.fast.ai/callbacks.html#EarlyStoppingCallback">EarlyStoppingCallback</a>
and <a
href="https://docs.fast.ai/callbacks.html#OneCycleScheduler">OneCycleScheduler</a>
callbacks</td>
<td><blockquote>
<p>--</p>
</blockquote></td>
<td>Model checkpoints are logged to a ‘models’ directory; <a
href="https://mlflow.org/docs/latest/models.html">MLflow Model</a>
(fastai Learner model) on training end; Model summary text is
logged</td>
</tr>
</tbody>
</table>

### Pytorch {#pytorch}

Call `mlflow.pytorch.autolog` before your Pytorch Lightning training
code to enable automatic logging of metrics, parameters, and models. See
example usages
[here](https://github.com/chauhang/mlflow/tree/master/examples/pytorch/MNIST).
Note that currently, Pytorch autologging supports only models trained
using Pytorch Lightning.

Autologging is triggered on calls to
`pytorch_lightning.trainer.Trainer.fit` and captures the following
information:

|                                             |                                                                                                                                                                                                      |                                                                                                                                                                                        |      |                                                                                                                                                                                                               |
|----------|-------------|-----------------|----|----------------------------|
| Framework/module                            | Metrics                                                                                                                                                                                              | Parameters                                                                                                                                                                             | Tags | Artifacts                                                                                                                                                                                                     |
| `pytorch_lightning.trainer.Trainer`         | Training loss; validation loss; average_test_accuracy; user-defined-metrics.                                                                                                                         | `fit()` parameters; optimizer name; learning rate; epsilon.                                                                                                                            | --   | Model summary on training start, [MLflow Model](https://mlflow.org/docs/latest/models.html) (Pytorch model) on training end;                                                                                  |
| `pytorch_lightning.callbacks.earlystopping` | Training loss; validation loss; average_test_accuracy; user-defined-metrics. Metrics from the `EarlyStopping` callbacks. For example, `stopped_epoch`, `restored_epoch`, `restore_best_weight`, etc. | `fit()` parameters; optimizer name; learning rate; epsilon Parameters from the `EarlyStopping` callbacks. For example, `min_delta`, `patience`, `baseline`,`restore_best_weights`, etc | --   | Model summary on training start; [MLflow Model](https://mlflow.org/docs/latest/models.html) (Pytorch model) on training end; Best Pytorch model checkpoint, if training stops due to early stopping callback. |

If no active run exists when `autolog()` captures data, MLflow will
automatically create a run to log information, ending the run once the
call to `pytorch_lightning.trainer.Trainer.fit()` completes.

If a run already exists when `autolog()` captures data, MLflow will log
to that run but not automatically end that run after training.

<div class="note" markdown="1">

<div class="title" markdown="1">

Note

</div>

\- Parameters not explicitly passed by users (parameters that use
default values) while using `pytorch_lightning.trainer.Trainer.fit()`
are not currently automatically logged - In case of a multi-optimizer
scenario (such as usage of autoencoder), only the parameters for the
first optimizer are logged

</div>

## Organizing Runs in Experiments {#organizing_runs_in_experiments}

MLflow allows you to group runs under experiments, which can be useful
for comparing runs intended to tackle a particular task. You can create
experiments using the `cli` (`mlflow experiments`) or the
`mlflow.create_experiment` Python API. You can pass the experiment name
for an individual run using the CLI (for example,
`mlflow run ... --experiment-name [name]`) or the
`MLFLOW_EXPERIMENT_NAME` environment variable. Alternatively, you can
use the experiment ID instead, via the `--experiment-id` CLI flag or the
`MLFLOW_EXPERIMENT_ID` environment variable.

~~~ bash
# Set the experiment via environment variables
export MLFLOW_EXPERIMENT_NAME=fraud-detection

mlflow experiments create --experiment-name fraud-detection
~~~

~~~ python
# Launch a run. The experiment is inferred from the MLFLOW_EXPERIMENT_NAME environment
# variable, or from the --experiment-name parameter passed to the MLflow CLI (the latter
# taking precedence)
with mlflow.start_run():
    mlflow.log_param("a", 1)
    mlflow.log_metric("b", 2)
~~~

### Managing Experiments and Runs with the Tracking Service API {#managing-experiments-and-runs-with-the-tracking-service-api}

MLflow provides a more detailed Tracking Service API for managing
experiments and runs directly, which is available through client SDK in
the `mlflow.client` module. This makes it possible to query data about
past runs, log additional information about them, create experiments,
add tags to a run, and more.

**Example**

~~~ python
from mlflow.tracking import MlflowClient

client = MlflowClient()
experiments = (
    client.search_experiments()
)  # returns a list of mlflow.entities.Experiment
run = client.create_run(experiments[0].experiment_id)  # returns mlflow.entities.Run
client.log_param(run.info.run_id, "hello", "world")
client.set_terminated(run.info.run_id)
~~~

#### Adding Tags to Runs {#adding-tags-to-runs}

The `MlflowClient.set_tag() <mlflow.client.MlflowClient.set_tag>`
function lets you add custom tags to runs. A tag can only have a single
unique value mapped to it at a time. For example:

~~~ python
client.set_tag(run.info.run_id, "tag_key", "tag_value")
~~~

<div class="important" markdown="1">

<div class="title" markdown="1">

Important

</div>

Do not use the prefix `mlflow.` (e.g. `mlflow.note`) for a tag. This
prefix is reserved for use by MLflow. See `system_tags` for a list of
reserved tag keys.

</div>

## Tracking UI {#tracking_ui}

The Tracking UI lets you visualize, search and compare runs, as well as
download run artifacts or metadata for analysis in other tools. If you
log runs to a local `mlruns` directory, run `mlflow ui` in the directory
above it, and it loads the corresponding runs. Alternatively, the
`MLflow tracking server <tracking_server>` serves the same UI and
enables remote storage of run artifacts. In that case, you can view the
UI using URL `http://<ip address of your MLflow tracking server>:5000`
in your browser from any machine, including any remote machine that can
connect to your tracking server.

The UI contains the following key features:

-   Experiment-based run listing and comparison (including run
    comparison across multiple experiments)
-   Searching for runs by parameter or metric value
-   Visualizing run metrics
-   Downloading run results

## Querying Runs Programmatically {#tracking_query_api}

You can access all of the functions in the Tracking UI programmatically.
This makes it easy to do several common tasks:

-   Query and compare runs using any data analysis tool of your choice,
    for example, **pandas**.
-   Determine the artifact URI for a run to feed some of its artifacts
    into a new run when executing a workflow. For an example of querying
    runs and constructing a multistep workflow, see the MLflow
    [Multistep Workflow Example
    project](https://github.com/mlflow/mlflow/blob/15cc05ce2217b7c7af4133977b07542934a9a19f/examples/multistep_workflow/main.py#L63).
-   Load artifacts from past runs as `models`. For an example of
    training, exporting, and loading a model, and predicting using the
    model, see the MLflow [Keras/TensorFlow
    example](https://github.com/mlflow/mlflow/blob/master/examples/keras/train.py).
-   Run automated parameter search algorithms, where you query the
    metrics from various runs to submit new ones. For an example of
    running automated parameter search algorithms, see the MLflow
    [Hyperparameter Tuning Example
    project](https://github.com/mlflow/mlflow/blob/master/examples/hyperparam/README.rst).

## MLflow Tracking Servers {#tracking_server}

<div class="contents" markdown="1" local="" depth="2">

In this section:

</div>

You run an MLflow tracking server using `mlflow server`. An example
configuration for a server is:

~~~ bash
mlflow server \
    --backend-store-uri /mnt/persistent-disk \
    --default-artifact-root s3://my-mlflow-bucket/ \
    --host 0.0.0.0
~~~

<div class="note" markdown="1">

<div class="title" markdown="1">

Note

</div>

When started in `--artifacts-only` mode, the tracking server will not
permit any operation other than saving, loading, and listing artifacts.

</div>

### Storage {#storage}

An MLflow tracking server has two components for storage: a *backend
store* and an *artifact store*.

#### Backend Stores {#backend-stores}

The backend store is where MLflow Tracking Server stores experiment and
run metadata as well as params, metrics, and tags for runs. MLflow
supports two types of backend stores: *file store* and *database-backed
store*.

<div class="note" markdown="1">

<div class="title" markdown="1">

Note

</div>

In order to use model registry functionality, you must run your server
using a database-backed store.

</div>

Use `--backend-store-uri` to configure the type of backend store. You
specify:

-   A file store backend as `./path_to_store` or `file:/path_to_store`
-   A database-backed store as [SQLAlchemy database
    URI](https://docs.sqlalchemy.org/en/latest/core/engines.html#database-urls).
    The database URI typically takes the format
    `<dialect>+<driver>://<username>:<password>@<host>:<port>/<database>`.
    MLflow supports the database dialects `mysql`, `mssql`, `sqlite`,
    and `postgresql`. Drivers are optional. If you do not specify a
    driver, SQLAlchemy uses a dialect's default driver. For example,
    `--backend-store-uri sqlite:///mlflow.db` would use a local SQLite
    database.

<div class="important" markdown="1">

<div class="title" markdown="1">

Important

</div>

`mlflow server` will fail against a database-backed store with an
out-of-date database schema. To prevent this, upgrade your database
schema to the latest supported version using
`mlflow db upgrade [db_uri]`. Schema migrations can result in database
downtime, may take longer on larger databases, and are not guaranteed to
be transactional. You should always take a backup of your database prior
to running `mlflow db upgrade` - consult your database's documentation
for instructions on taking a backup.

</div>

<div class="note" markdown="1">

<div class="title" markdown="1">

Note

</div>

`2d6e25af4d3e_increase_max_param_val_length` is a non-invertible
migration script that increases the param value length to 8k (but we
limit param value max length to 6000 internally). Please be careful if
you want to upgrade and backup your database before upgrading.

</div>

By default `--backend-store-uri` is set to the local `./mlruns`
directory (the same as when running `mlflow run` locally), but when
running a server, make sure that this points to a persistent (that is,
non-ephemeral) file system location.

#### Artifact Stores {#artifact-stores}

<div class="contents" markdown="1" local="" depth="1">

In this section:

</div>

The artifact store is a location suitable for large data (such as an S3
bucket or shared NFS file system) and is where clients log their
artifact output (for example, models). `artifact_location` is a property
recorded on `mlflow.entities.Experiment` for default location to store
artifacts for all runs in this experiment. Additionally, `artifact_uri`
is a property on `mlflow.entities.RunInfo` to indicate location where
all artifacts for this run are stored.

The MLflow client caches artifact location information on a per-run
basis. It is therefore not recommended to alter a run's artifact
location before it has terminated.

In addition to local file paths, MLflow supports the following storage
systems as artifact stores: Amazon S3, Azure Blob Storage, Google Cloud
Storage, SFTP server, and NFS.

Use `--default-artifact-root` (defaults to local `./mlruns` directory)
to configure default location to server's artifact store. This will be
used as artifact location for newly-created experiments that do not
specify one. Once you create an experiment, `--default-artifact-root` is
no longer relevant to that experiment.

By default, a server is launched with the `--serve-artifacts` flag to
enable proxied access for artifacts. The uri `mlflow-artifacts:/`
replaces an otherwise explicit object store destination (e.g.,
"s3:/my_bucket/mlartifacts") for interfacing with artifacts. The client
can access artifacts via HTTP requests to the MLflow Tracking Server.
This simplifies access requirements for users of the MLflow client,
eliminating the need to configure access tokens or username and password
environment variables for the underlying object store when writing or
retrieving artifacts. To disable proxied access for artifacts, specify
`--no-serve-artifacts`.

Provided an MLflow server configuration where the
`--default-artifact-root` is `s3://my-root-bucket`, the following
patterns will all resolve to the configured proxied object store
location of `s3://my-root-bucket/mlartifacts`:

> -   `https://<host>:<port>/mlartifacts`
> -   `http://<host>/mlartifacts`
> -   `mlflow-artifacts://<host>/mlartifacts`
> -   `mlflow-artifacts://<host>:<port>/mlartifacts`
> -   `mlflow-artifacts:/mlartifacts`

If the `host` or `host:port` declaration is absent in client artifact
requests to the MLflow server, the client API will assume that the host
is the same as the MLflow Tracking uri.

<div class="note" markdown="1">

<div class="title" markdown="1">

Note

</div>

If an MLflow server is running with the `--artifact-only` flag, the
client should interact with this server explicitly by including either a
`host` or `host:port` definition for uri location references for
artifacts. Otherwise, all artifact requests will route to the MLflow
Tracking server, defeating the purpose of running a distinct artifact
server.

</div>

<div class="important" markdown="1">

<div class="title" markdown="1">

Important

</div>

Access credentials and configuration for the artifact storage location
are configured *once during server initialization* in the place of
having users handle access credentials for artifact-based operations.
Note that *all users who have access to the Tracking Server in this mode
will have access to artifacts served through this assumed role*.

</div>

To allow the server and clients to access the artifact location, you
should configure your cloud provider credentials as normal. For example,
for S3, you can set the `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY`
environment variables, use an IAM role, or configure a default profile
in `~/.aws/credentials`. See [Set up AWS Credentials and Region for
Development](https://docs.aws.amazon.com/sdk-for-java/latest/developer-guide/setup-credentials.html)
for more info.

<div class="important" markdown="1">

<div class="title" markdown="1">

Important

</div>

If you do not specify a `--default-artifact-root` or an artifact URI
when creating the experiment (for example,
`mlflow experiments create --artifact-location s3://<my-bucket>`), the
artifact root is a path inside the file store. Typically this is not an
appropriate location, as the client and server probably refer to
different physical locations (that is, the same path on different
disks).

</div>

You may set an MLflow environment variable to configure the timeout for
artifact uploads and downloads:

-   `MLFLOW_ARTIFACT_UPLOAD_DOWNLOAD_TIMEOUT` - (Experimental, may be
    changed or removed) Sets the timeout for artifact upload/download in
    seconds (Default set by individual artifact stores).

##### Amazon S3 and S3-compatible storage {#amazon-s3-and-s3-compatible-storage}

To store artifacts in S3 (whether on Amazon S3 or on an S3-compatible
alternative, such as [MinIO](https://min.io/) or [Digital Ocean
Spaces](https://www.digitalocean.com/products/spaces)), specify a URI of
the form `s3://<bucket>/<path>`. MLflow obtains credentials to access S3
from your machine's IAM role, a profile in `~/.aws/credentials`, or the
environment variables `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY`
depending on which of these are available. For more information on how
to set credentials, see [Set up AWS Credentials and Region for
Development](https://docs.aws.amazon.com/sdk-for-java/latest/developer-guide/setup-credentials.html).

To add S3 file upload extra arguments, set `MLFLOW_S3_UPLOAD_EXTRA_ARGS`
to a JSON object of key/value pairs. For example, if you want to upload
to a KMS Encrypted bucket using the KMS Key 1234:

~~~ bash
export MLFLOW_S3_UPLOAD_EXTRA_ARGS='{"ServerSideEncryption": "aws:kms", "SSEKMSKeyId": "1234"}'
~~~

For a list of available extra args see [Boto3 ExtraArgs
Documentation](https://github.com/boto/boto3/blob/develop/docs/source/guide/s3-uploading-files.rst#the-extraargs-parameter).

To store artifacts in a custom endpoint, set the
`MLFLOW_S3_ENDPOINT_URL` to your endpoint's URL. For example, if you are
using Digital Ocean Spaces:

~~~ bash
export MLFLOW_S3_ENDPOINT_URL=https://<region>.digitaloceanspaces.com
~~~

If you have a MinIO server at 1.2.3.4 on port 9000:

~~~ bash
export MLFLOW_S3_ENDPOINT_URL=http://1.2.3.4:9000
~~~

If the MinIO server is configured with using SSL self-signed or signed
using some internal-only CA certificate, you could set
`MLFLOW_S3_IGNORE_TLS` or `AWS_CA_BUNDLE` variables (not both at the
same time!) to disable certificate signature check, or add a custom CA
bundle to perform this check, respectively:

~~~ bash
export MLFLOW_S3_IGNORE_TLS=true
#or
export AWS_CA_BUNDLE=/some/ca/bundle.pem
~~~

Additionally, if MinIO server is configured with non-default region, you
should set `AWS_DEFAULT_REGION` variable:

~~~ bash
export AWS_DEFAULT_REGION=my_region
~~~

<div class="warning" markdown="1">

<div class="title" markdown="1">

Warning

</div>

The MLflow tracking server utilizes specific reserved keywords to
generate a qualified path. These environment configurations, if present
in the client environment, can create path resolution issues. For
example, providing `--default-artifact-root $MLFLOW_S3_ENDPOINT_URL` on
the server side **and** `MLFLOW_S3_ENDPOINT_URL` on the client side will
create a client path resolution issue for the artifact storage location.
Upon resolving the artifact storage location, the MLflow client will use
the value provided by `--default-artifact-root` and suffixes the
location with the values provided in the environment variable
`MLFLOW_S3_ENDPOINT_URL`. Depending on the value set for the environment
variable `MLFLOW_S3_ENDPOINT_URL`, the resulting artifact storage path
for this scenario would be one of the following invalid object store
paths:
`https://<bucketname>.s3.<region>.amazonaws.com/<key>/<bucketname>/<key>`
or `s3://<bucketname>/<key>/<bucketname>/<key>`. To prevent path parsing
issues, ensure that reserved environment variables are removed (`unset`)
from client environments.

</div>

Complete list of configurable values for an S3 client is available in
[boto3
documentation](https://boto3.amazonaws.com/v1/documentation/api/latest/guide/configuration.html#configuration).

##### Azure Blob Storage {#azure-blob-storage}

To store artifacts in Azure Blob Storage, specify a URI of the form
`wasbs://<container>@<storage-account>.blob.core.windows.net/<path>`.
MLflow expects Azure Storage access credentials in the
`AZURE_STORAGE_CONNECTION_STRING`, `AZURE_STORAGE_ACCESS_KEY`
environment variables or having your credentials configured such that
the
[DefaultAzureCredential()](https://docs.microsoft.com/en-us/python/api/overview/azure/identity-readme?view=azure-python).
class can pick them up. The order of precedence is:

1.  `AZURE_STORAGE_CONNECTION_STRING`
2.  `AZURE_STORAGE_ACCESS_KEY`
3.  `DefaultAzureCredential()`

You must set one of these options on both your client application and
your MLflow tracking server. Also, you must run
`pip install azure-storage-blob` separately (on both your client and the
server) to access Azure Blob Storage. Finally, if you want to use
DefaultAzureCredential, you must `pip install azure-identity`; MLflow
does not declare a dependency on these packages by default.

You may set an MLflow environment variable to configure the timeout for
artifact uploads and downloads:

-   `MLFLOW_ARTIFACT_UPLOAD_DOWNLOAD_TIMEOUT` - (Experimental, may be
    changed or removed) Sets the timeout for artifact upload/download in
    seconds (Default: 600 for Azure blob).

##### Google Cloud Storage {#google-cloud-storage}

To store artifacts in Google Cloud Storage, specify a URI of the form
`gs://<bucket>/<path>`. You should configure credentials for accessing
the GCS container on the client and server as described in the [GCS
documentation](https://google-cloud.readthedocs.io/en/latest/core/auth.html).
Finally, you must run `pip install google-cloud-storage` (on both your
client and the server) to access Google Cloud Storage; MLflow does not
declare a dependency on this package by default.

You may set some MLflow environment variables to troubleshoot GCS
read-timeouts (eg. due to slow transfer speeds) using the following
variables:

-   `MLFLOW_ARTIFACT_UPLOAD_DOWNLOAD_TIMEOUT` - (Experimental, may be
    changed or removed) Sets the standard timeout for transfer
    operations in seconds (Default: 60 for GCS). Use -1 for indefinite
    timeout.
-   `MLFLOW_GCS_DEFAULT_TIMEOUT` - (Deprecated, please use
    `MLFLOW_ARTIFACT_UPLOAD_DOWNLOAD_TIMEOUT`) Sets the standard timeout
    for transfer operations in seconds (Default: 60). Use -1 for
    indefinite timeout.
-   `MLFLOW_GCS_UPLOAD_CHUNK_SIZE` - Sets the standard upload chunk size
    for bigger files in bytes (Default: 104857600 ≙ 100MiB), must be
    multiple of 256 KB.
-   `MLFLOW_GCS_DOWNLOAD_CHUNK_SIZE` - Sets the standard download chunk
    size for bigger files in bytes (Default: 104857600 ≙ 100MiB), must
    be multiple of 256 KB

##### FTP server {#ftp-server}

To store artifacts in a FTP server, specify a URI of the form
<ftp://user@host/path/to/directory> . The URI may optionally include a
password for logging into the server, e.g.
`ftp://user:pass@host/path/to/directory`

##### SFTP Server {#sftp-server}

To store artifacts in an SFTP server, specify a URI of the form
`sftp://user@host/path/to/directory`. You should configure the client to
be able to log in to the SFTP server without a password over SSH (e.g.
public key, identity file in ssh_config, etc.).

The format `sftp://user:pass@host/` is supported for logging in.
However, for safety reasons this is not recommended.

When using this store, `pysftp` must be installed on both the server and
the client. Run `pip install pysftp` to install the required package.

##### NFS {#nfs}

To store artifacts in an NFS mount, specify a URI as a normal file
system path, e.g., `/mnt/nfs`. This path must be the same on both the
server and the client -- you may need to use symlinks or remount the
client in order to enforce this property.

##### HDFS {#hdfs}

To store artifacts in HDFS, specify a `hdfs:` URI. It can contain host
and port: `hdfs://<host>:<port>/<path>` or just the path:
`hdfs://<path>`.

There are also two ways to authenticate to HDFS:

-   Use current UNIX account authorization
-   Kerberos credentials using following environment variables:

~~~ bash
export MLFLOW_KERBEROS_TICKET_CACHE=/tmp/krb5cc_22222222
export MLFLOW_KERBEROS_USER=user_name_to_use
~~~

Most of the cluster contest settings are read from `hdfs-site.xml`
accessed by the HDFS native driver using the `CLASSPATH` environment
variable.

The used HDFS driver is `libhdfs`.

#### File store performance {#file-store-performance}

MLflow will automatically try to use
[LibYAML](https://pyyaml.org/wiki/LibYAML) bindings if they are already
installed. However if you notice any performance issues when using *file
store* backend, it could mean LibYAML is not installed on your system.
On Linux or Mac you can easily install it using your system package
manager:

~~~ sh
# On Ubuntu/Debian
apt-get install libyaml-cpp-dev libyaml-dev

# On macOS using Homebrew
brew install yaml-cpp libyaml
~~~

After installing LibYAML, you need to reinstall PyYAML:

~~~ sh
# Reinstall PyYAML
pip --no-cache-dir install --force-reinstall -I pyyaml
~~~

#### Deletion Behavior {#deletion-behavior}

In order to allow MLflow Runs to be restored, Run metadata and artifacts
are not automatically removed from the backend store or artifact store
when a Run is deleted. The `mlflow gc <cli>` CLI is provided for
permanently removing Run metadata and artifacts for deleted runs.

#### SQLAlchemy Options {#sqlalchemy-options}

You can inject some [SQLAlchemy connection pooling
options](https://docs.sqlalchemy.org/en/latest/core/pooling.html) using
environment variables.

|                                       |                             |
|---------------------------------------|-----------------------------|
| MLflow Environment Variable           | SQLAlchemy QueuePool Option |
| `MLFLOW_SQLALCHEMYSTORE_POOL_SIZE`    | `pool_size`                 |
| `MLFLOW_SQLALCHEMYSTORE_POOL_RECYCLE` | `pool_recycle`              |
| `MLFLOW_SQLALCHEMYSTORE_MAX_OVERFLOW` | `max_overflow`              |

### Networking {#networking}

The `--host` option exposes the service on all interfaces. If running a
server in production, we would recommend not exposing the built-in
server broadly (as it is unauthenticated and unencrypted), and instead
putting it behind a reverse proxy like NGINX or Apache httpd, or
connecting over VPN. You can then pass authentication headers to MLflow
using these `environment variables <tracking_auth>`.

Additionally, you should ensure that the `--backend-store-uri` (which
defaults to the `./mlruns` directory) points to a persistent
(non-ephemeral) disk or database connection.

### Using the Tracking Server for proxied artifact access {#artifact_only_mode}

To use an instance of the MLflow Tracking server for artifact operations
( `scenario_5` ), start a server with the optional parameters
`--serve-artifacts` to enable proxied artifact access and set a path to
record artifacts to by providing a value for the argument
`--artifacts-destination`. The tracking server will, in this mode,
stream any artifacts that a client is logging directly through an
assumed (server-side) identity, eliminating the need for access
credentials to be handled by end-users.

<div class="note" markdown="1">

<div class="title" markdown="1">

Note

</div>

Authentication access to the value set by `--artifacts-destination` must
be configured when starting the tracking server, if required.

</div>

To start the MLflow server with proxy artifact access enabled to an HDFS
location (as an example):

~~~ bash
export HADOOP_USER_NAME=mlflowserverauth

mlflow server \
    --host 0.0.0.0 \
    --port 8885 \
    --artifacts-destination hdfs://myhost:8887/mlprojects/models \
~~~

#### Optionally using a Tracking Server instance exclusively for artifact handling {#optionally-using-a-tracking-server-instance-exclusively-for-artifact-handling}

If the volume of tracking server requests is sufficiently large and
performance issues are noticed, a tracking server can be configured to
serve in `--artifacts-only` mode ( `scenario_6` ), operating in tandem
with an instance that operates with `--no-serve-artifacts` specified.
This configuration ensures that the processing of artifacts is isolated
from all other tracking server event handling.

When a tracking server is configured in `--artifacts-only` mode, any
tasks apart from those concerned with artifact handling (i.e., model
logging, loading models, logging artifacts, listing artifacts, etc.)
will return an HTTPError. See the following example of a client REST
call in Python attempting to list experiments from a server that is
configured in `--artifacts-only` mode:

~~~ python
import requests

response = requests.get("http://0.0.0.0:8885/api/2.0/mlflow/experiments/list")
~~~

Output

~~~ text
>> HTTPError: Endpoint: /api/2.0/mlflow/experiments/list disabled due to the mlflow server running in `--artifacts-only` mode.
~~~

Using an additional MLflow server to handle artifacts exclusively can be
useful for large-scale MLOps infrastructure. Decoupling the longer
running and more compute-intensive tasks of artifact handling from the
faster and higher-volume metadata functionality of the other Tracking
API requests can help minimize the burden of an otherwise single MLflow
server handling both types of payloads.

### Logging to a Tracking Server {#logging_to_a_tracking_server}

To log to a tracking server, set the `MLFLOW_TRACKING_URI` environment
variable to the server's URI, along with its scheme and port (for
example, `http://10.0.0.1:5000`) or call `mlflow.set_tracking_uri`.

The `mlflow.start_run`, `mlflow.log_param`, and `mlflow.log_metric`
calls then make API requests to your remote tracking server.

> <div class="code-section" markdown="1">
>
> ~~~ python
> import mlflow
>
> remote_server_uri = "..."  # set to your server URI
> mlflow.set_tracking_uri(remote_server_uri)
> # Note: on Databricks, the experiment name passed to mlflow_set_experiment must be a
> # valid path in the workspace
> mlflow.set_experiment("/my-experiment")
> with mlflow.start_run():
>     mlflow.log_param("a", 1)
>     mlflow.log_metric("b", 2)
> ~~~
>
> ~~~ R
> library(mlflow)
> install_mlflow()
> remote_server_uri = "..." # set to your server URI
> mlflow_set_tracking_uri(remote_server_uri)
> # Note: on Databricks, the experiment name passed to mlflow_set_experiment must be a
> # valid path in the workspace
> mlflow_set_experiment("/my-experiment")
> mlflow_log_param("a", "1")
> ~~~
>
> </div>

<div id="tracking_auth" markdown="1">

In addition to the `MLFLOW_TRACKING_URI` environment variable, the
following environment variables allow passing HTTP authentication to the
tracking server:

</div>

-   `MLFLOW_TRACKING_USERNAME` and `MLFLOW_TRACKING_PASSWORD` - username
    and password to use with HTTP Basic authentication. To use Basic
    authentication, you must set `both`
    environment variables .
-   `MLFLOW_TRACKING_TOKEN` - token to use with HTTP Bearer
    authentication. Basic authentication takes precedence if set.
-   `MLFLOW_TRACKING_INSECURE_TLS` - If set to the literal `true`,
    MLflow does not verify the TLS connection, meaning it does not
    validate certificates or hostnames for `https://` tracking URIs.
    This flag is not recommended for production environments. If this is
    set to `true` then `MLFLOW_TRACKING_SERVER_CERT_PATH` must not be
    set.
-   `MLFLOW_TRACKING_SERVER_CERT_PATH` - Path to a CA bundle to use.
    Sets the `verify` param of the `requests.request` function (see
    [requests main
    interface](https://requests.readthedocs.io/en/master/api/)). When
    you use a self-signed server certificate you can use this to verify
    it on client side. If this is set `MLFLOW_TRACKING_INSECURE_TLS`
    must not be set (false).
-   `MLFLOW_TRACKING_CLIENT_CERT_PATH` - Path to ssl client cert file
    (.pem). Sets the `cert` param of the `requests.request` function
    (see [requests main
    interface](https://requests.readthedocs.io/en/master/api/)). This
    can be used to use a (self-signed) client certificate.

<div class="note" markdown="1">

<div class="title" markdown="1">

Note

</div>

If the MLflow server is *not configured* with the `--serve-artifacts`
option, the client directly pushes artifacts to the artifact store. It
does not proxy these through the tracking server by default.

For this reason, the client needs direct access to the artifact store.
For instructions on setting up these credentials, see
`Artifact Stores <artifact-stores>`.

</div>

#### Tracking Server versioning {#tracking-server-versioning}

The version of MLflow running on the server can be found by querying the
`/version` endpoint. This can be used to check that the client-side
version of MLflow is up-to-date with a remote tracking server prior to
running experiments. For example:

~~~ python
import requests
import mlflow

response = requests.get("http://<mlflow-host>:<mlflow-port>/version")
assert response.text == mlflow.__version__  # Checking for a strict version match
~~~

## System Tags {#system_tags}

You can annotate runs with arbitrary tags. Tag keys that start with
`mlflow.` are reserved for internal use. The following tags are set
automatically by MLflow, when appropriate:

| Key                         | Description                                                                                                                                                                                                                          |
|--------------------|----------------------------------------------------|
| `mlflow.note.content`       | A descriptive note about this run. This reserved tag is not set automatically and can be overridden by the user to include additional information about the run. The content is displayed on the run's page under the Notes section. |
| `mlflow.parentRunId`        | The ID of the parent run, if this is a nested run.                                                                                                                                                                                   |
| `mlflow.user`               | Identifier of the user who created the run.                                                                                                                                                                                          |
| `mlflow.source.type`        | Source type. Possible values: `"NOTEBOOK"`, `"JOB"`, `"PROJECT"`, `"LOCAL"`, and `"UNKNOWN"`                                                                                                                                         |
| `mlflow.source.name`        | Source identifier (e.g., GitHub URL, local Python filename, name of notebook)                                                                                                                                                        |
| `mlflow.source.git.commit`  | Commit hash of the executed code, if in a git repository.                                                                                                                                                                            |
| `mlflow.source.git.branch`  | Name of the branch of the executed code, if in a git repository.                                                                                                                                                                     |
| `mlflow.source.git.repoURL` | URL that the executed code was cloned from.                                                                                                                                                                                          |
| `mlflow.project.env`        | The runtime context used by the MLflow project. Possible values: `"docker"` and `"conda"`.                                                                                                                                           |
| `mlflow.project.entryPoint` | Name of the project entry point associated with the current run, if any.                                                                                                                                                             |
| `mlflow.docker.image.name`  | Name of the Docker image used to execute this run.                                                                                                                                                                                   |
| `mlflow.docker.image.id`    | ID of the Docker image used to execute this run.                                                                                                                                                                                     |
| `mlflow.log-model.history`  | Model metadata collected by log-model calls. Includes the serialized form of the MLModel model files logged to a run, although the exact format and information captured is subject to change.                                       |
