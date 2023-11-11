# MLflow Plugins {#plugins}

As a framework-agnostic tool for machine learning, the MLflow Python API
provides developer APIs for writing plugins that integrate with
different ML frameworks and backends.

Plugins provide a powerful mechanism for customizing the behavior of the
MLflow Python client and integrating third-party tools, allowing you to:

-   Integrate with third-party storage solutions for experiment data,
    artifacts, and models
-   Integrate with third-party authentication providers, e.g. read HTTP
    authentication credentials from a special file
-   Use the MLflow client to communicate with other REST APIs, e.g. your
    organization's existing experiment-tracking APIs
-   Automatically capture additional metadata as run tags, e.g. the git
    repository associated with a run
-   Add new backend to execute MLflow Project entrypoints.

The MLflow Python API supports several types of plugins:

-   **Tracking Store**: override tracking backend logic, e.g. to log to
    a third-party storage solution
-   **ArtifactRepository**: override artifact logging logic, e.g. to log
    to a third-party storage solution
-   **Run context providers**: specify context tags to be set on runs
    created via the `mlflow.start_run` fluent API.
-   **Model Registry Store**: override model registry backend logic,
    e.g. to log to a third-party storage solution
-   **MLflow Project backend**: override the local execution backend to
    execute a project on your own cluster (Databricks, kubernetes, etc.)
-   **MLflow ModelEvaluator**: Define custom model evaluator, which can
    be used in `mlflow.evaluate` API.

<div class="contents" markdown="1" local="" depth="3">

Table of Contents

</div>

## Using an MLflow Plugin {#using-an-mlflow-plugin}

MLflow plugins are Python packages that you can install using PyPI or
conda. This example installs a Tracking Store plugin from source and
uses it within an example script.

### Install the Plugin {#install-the-plugin}

To get started, clone MLflow and install [this example
plugin](https://github.com/mlflow/mlflow/tree/master/tests/resources/mlflow-test-plugin):

~~~ bash
git clone https://github.com/mlflow/mlflow
cd mlflow
pip install -e tests/resources/mlflow-test-plugin
~~~

### Run Code Using the Plugin {#run-code-using-the-plugin}

This plugin defines a custom Tracking Store for tracking URIs with the
`file-plugin` scheme. The plugin implementation delegates to MLflow's
built-in file-based run storage. To use the plugin, you can run any code
that uses MLflow, setting the tracking URI to one with a
`file-plugin://` scheme:

~~~ bash
MLFLOW_TRACKING_URI=file-plugin:$(PWD)/mlruns python examples/quickstart/mlflow_tracking.py
~~~

Launch the MLflow UI:

~~~ bash
cd ..
mlflow server --backend-store-uri ./mlflow/mlruns
~~~

View results at <http://localhost:5000>. You should see a newly-created
run with a param named "param1" and a metric named "foo":

> ![image](./../static/images/quickstart/quickstart_ui_screenshot.png)

### Use Plugin for Client Side Authentication {#use-plugin-for-client-side-authentication}

MLflow provides `RequestAuthProvider` plugin to customize auth header
for outgoing http request.

To use it, implement the `RequestAuthProvider` class and override the
`get_name` and `get_auth` methods. `get_name` should return the name of
your auth provider, while `get_auth` should return the auth object that
will be added to the http request.

~~~ python
from mlflow.tracking.request_auth.abstract_request_auth_provider import (
    RequestAuthProvider,
)


class DummyAuthProvider(RequestAuthProvider):
    def get_name(self):
        return "dummy_auth_provider_name"

    def get_auth(self):
        return DummyAuth()
~~~

Once you have the implemented request auth provider class, register it
in the `entry_points` and install the plugin.

~~~ python
setup(
    entry_points={
        "mlflow.request_auth_provider": "dummy-backend=DummyAuthProvider",
    },
)
~~~

Then set environment variable `MLFLOW_TRACKING_AUTH` to enable the
injection of custom auth. The value of this environment variable should
match the name of the auth provider.

~~~ bash
export MLFLOW_TRACKING_AUTH=dummy_auth_provider_name
~~~

## Writing Your Own MLflow Plugins {#writing-your-own-mlflow-plugins}

### Defining a Plugin {#defining-a-plugin}

You define an MLflow plugin as a standalone Python package that can be
distributed for installation via PyPI or conda. See
<https://github.com/mlflow/mlflow/tree/master/tests/resources/mlflow-test-plugin>
for an example package that implements all available plugin types.

The example package contains a `setup.py` that declares a number of
[entry
points](https://setuptools.readthedocs.io/en/latest/setuptools.html#dynamic-discovery-of-services-and-plugins):

~~~ python
setup(
    name="mflow-test-plugin",
    # Require MLflow as a dependency of the plugin, so that plugin users can simply install
    # the plugin and then immediately use it with MLflow
    install_requires=["mlflow"],
    ...,
    entry_points={
        # Define a Tracking Store plugin for tracking URIs with scheme 'file-plugin'
        "mlflow.tracking_store": "file-plugin=mlflow_test_plugin.file_store:PluginFileStore",
        # Define a ArtifactRepository plugin for artifact URIs with scheme 'file-plugin'
        "mlflow.artifact_repository": "file-plugin=mlflow_test_plugin.local_artifact:PluginLocalArtifactRepository",
        # Define a RunContextProvider plugin. The entry point name for run context providers
        # is not used, and so is set to the string "unused" here
        "mlflow.run_context_provider": "unused=mlflow_test_plugin.run_context_provider:PluginRunContextProvider",
        # Define a RequestHeaderProvider plugin. The entry point name for request header providers
        # is not used, and so is set to the string "unused" here
        "mlflow.request_header_provider": "unused=mlflow_test_plugin.request_header_provider:PluginRequestHeaderProvider",
        # Define a RequestAuthProvider plugin. The entry point name for request auth providers
        # is not used, and so is set to the string "unused" here
        "mlflow.request_auth_provider": "unused=mlflow_test_plugin.request_auth_provider:PluginRequestAuthProvider",
        # Define a Model Registry Store plugin for tracking URIs with scheme 'file-plugin'
        "mlflow.model_registry_store": "file-plugin=mlflow_test_plugin.sqlalchemy_store:PluginRegistrySqlAlchemyStore",
        # Define a MLflow Project Backend plugin called 'dummy-backend'
        "mlflow.project_backend": "dummy-backend=mlflow_test_plugin.dummy_backend:PluginDummyProjectBackend",
        # Define a MLflow model deployment plugin for target 'faketarget'
        "mlflow.deployments": "faketarget=mlflow_test_plugin.fake_deployment_plugin",
        # Define a MLflow model evaluator with name "dummy_evaluator"
        "mlflow.model_evaluator": "dummy_evaluator=mlflow_test_plugin.dummy_evaluator:DummyEvaluator",
    },
)
~~~

Each element of this `entry_points` dictionary specifies a single
plugin. You can choose to implement one or more plugin types in your
package, and need not implement them all. The type of plugin defined by
each entry point and its corresponding reference implementation in
MLflow are described below. You can work from the reference
implementations when writing your own plugin:

<table>
<colgroup>
<col style="width: 9%" />
<col style="width: 9%" />
<col style="width: 72%" />
<col style="width: 9%" />
</colgroup>
<thead>
<tr class="header">
<th>Description</th>
<th>Entry-point group</th>
<th>Entry-point name and value</th>
<th>Reference Implementation</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td><p>Plugins for overriding definitions of tracking APIs like
<code>mlflow.log_metric</code>, <code>mlflow.start_run</code> for a
specific tracking URI scheme.</p></td>
<td><p>mlflow.tracking_store</p></td>
<td><p>The entry point value (e.g.
<code>mlflow_test_plugin.local_store:PluginFileStore</code>) specifies a
custom subclass of <a
href="https://github.com/mlflow/mlflow/blob/branch-1.5/mlflow/store/tracking/abstract_store.py#L8">mlflow.tracking.store.AbstractStore</a>
(e.g., the <a
href="https://github.com/mlflow/mlflow/blob/branch-1.5/tests/resources/mlflow-test-plugin/mlflow_test_plugin/__init__.py#L9">PluginFileStore
class</a> within the <code>mlflow_test_plugin</code> module).</p>
<p>The entry point name (e.g. <code>file-plugin</code>) is the tracking
URI scheme with which to associate the custom AbstractStore
implementation.</p>
<p>Users who install the example plugin and set a tracking URI of the
form <code>file-plugin://&lt;path&gt;</code> will use the custom
AbstractStore implementation defined in <code>PluginFileStore</code>.
The full tracking URI is passed to the <code>PluginFileStore</code>
constructor.</p></td>
<td><p><a
href="https://github.com/mlflow/mlflow/blob/branch-1.5/mlflow/store/tracking/file_store.py#L80">FileStore</a></p></td>
</tr>
<tr class="even">
<td><p>Plugins for defining artifact read/write APIs like
<code>mlflow.log_artifact</code>,
<code>MlflowClient.download_artifacts</code> for a specified artifact
URI scheme (e.g. the scheme used by your in-house blob storage
system).</p></td>
<td><p>mlflow.artifact_repository</p></td>
<td><p>The entry point value (e.g.
<code>mlflow_test_plugin.local_artifact:PluginLocalArtifactRepository</code>)
specifies a custom subclass of <a
href="https://github.com/mlflow/mlflow/blob/branch-1.5/mlflow/store/artifact/artifact_repo.py#L12">mlflow.store.artifact.artifact_repo.ArtifactRepository</a>
(e.g., the <a
href="https://github.com/mlflow/mlflow/blob/branch-1.5/tests/resources/mlflow-test-plugin/mlflow_test_plugin/__init__.py#L18">PluginLocalArtifactRepository
class</a> within the <code>mlflow_test_plugin</code> module).</p>
<p>The entry point name (e.g. <code>file-plugin</code>) is the artifact
URI scheme with which to associate the custom ArtifactRepository
implementation.</p>
<p>Users who install the example plugin and log to a run whose artifact
URI is of the form <code>file-plugin://&lt;path&gt;</code> will use the
custom ArtifactRepository implementation defined in
<code>PluginLocalArtifactRepository</code>. The full artifact URI is
passed to the <code>PluginLocalArtifactRepository</code>
constructor.</p></td>
<td><p><a
href="https://github.com/mlflow/mlflow/blob/branch-1.5/mlflow/store/artifact/local_artifact_repo.py#L10">LocalArtifactRepository</a></p></td>
</tr>
<tr class="odd">
<td>Plugins for specifying custom context tags at run creation time,
e.g. tags identifying the git repository associated with a run.</td>
<td>mlflow.run_context_provider</td>
<td>The entry point name is unused. The entry point value (e.g.
<code>mlflow_test_plugin.run_context_provider:PluginRunContextProvider</code>)
specifies a custom subclass of <a
href="https://github.com/mlflow/mlflow/blob/branch-1.13/mlflow/tracking/context/abstract_context.py#L4">mlflow.tracking.context.abstract_context.RunContextProvider</a>
(e.g., the <a
href="https://github.com/mlflow/mlflow/blob/branch-1.13/tests/resources/mlflow-test-plugin/mlflow_test_plugin/run_context_provider.py">PluginRunContextProvider
class</a> within the <code>mlflow_test_plugin</code> module) to
register.</td>
<td><a
href="https://github.com/mlflow/mlflow/blob/branch-1.13/mlflow/tracking/context/git_context.py#L38">GitRunContext</a>,
<a
href="https://github.com/mlflow/mlflow/blob/branch-1.13/mlflow/tracking/context/default_context.py#L41">DefaultRunContext</a></td>
</tr>
<tr class="even">
<td>Plugins for specifying custom context request headers to attach to
outgoing requests, e.g. headers identifying the client's
environment.</td>
<td>mlflow.request_header_provider</td>
<td>The entry point name is unused. The entry point value (e.g.
<code>mlflow_test_plugin.request_header_provider:PluginRequestHeaderProvider</code>)
specifies a custom subclass of <a
href="https://github.com/mlflow/mlflow/blob/master/mlflow/tracking/request_header/abstract_request_header_provider.py#L4">mlflow.tracking.request_header.abstract_request_header_provider.RequestHeaderProvider</a>
(e.g., the <a
href="https://github.com/mlflow/mlflow/blob/master/tests/resources/mlflow-test-plugin/mlflow_test_plugin/request_header_provider.py">PluginRequestHeaderProvider
class</a> within the <code>mlflow_test_plugin</code> module) to
register.</td>
<td><a
href="https://github.com/mlflow/mlflow/blob/master/mlflow/tracking/request_header/databricks_request_header_provider.py">DatabricksRequestHeaderProvider</a></td>
</tr>
<tr class="odd">
<td>Plugins for specifying custom request auth to attach to outgoing
requests.</td>
<td>mlflow.request_auth_provider</td>
<td>The entry point name is unused. The entry point value (e.g.
<code>mlflow_test_plugin.request_auth_provider:PluginRequestAuthProvider</code>)
specifies a custom subclass of <a
href="https://github.com/mlflow/mlflow/blob/master/mlflow/tracking/request_auth/abstract_request_auth_provider.py#L4">mlflow.tracking.request_auth.abstract_request_auth_provider.RequestAuthProvider</a>
(e.g., the <a
href="https://github.com/mlflow/mlflow/blob/master/tests/resources/mlflow-test-plugin/mlflow_test_plugin/request_auth_provider.py">PluginRequestAuthProvider
class</a> within the <code>mlflow_test_plugin</code> module) to
register.</td>
<td>N/A (will be added soon)</td>
</tr>
<tr class="even">
<td><p>Plugins for overriding definitions of Model Registry APIs like
<code>mlflow.register_model</code>.</p></td>
<td><p>mlflow.model_registry_store</p></td>
<td><p>The entry point value (e.g.
<code>mlflow_test_plugin.sqlalchemy_store:PluginRegistrySqlAlchemyStore</code>)
specifies a custom subclass of <a
href="https://github.com/mlflow/mlflow/blob/branch-1.5/mlflow/store/model_registry/abstract_store.py#L6">mlflow.tracking.model_registry.AbstractStore</a>
(e.g., the <a
href="https://github.com/mlflow/mlflow/blob/branch-1.5/tests/resources/mlflow-test-plugin/mlflow_test_plugin/__init__.py#L33">PluginRegistrySqlAlchemyStore
class</a> within the <code>mlflow_test_plugin</code> module)</p>
<p>The entry point name (e.g. <code>file-plugin</code>) is the tracking
URI scheme with which to associate the custom AbstractStore
implementation.</p>
<p>Users who install the example plugin and set a tracking URI of the
form <code>file-plugin://&lt;path&gt;</code> will use the custom
AbstractStore implementation defined in <code>PluginFileStore</code>.
The full tracking URI is passed to the <code>PluginFileStore</code>
constructor.</p></td>
<td><p><a
href="https://github.com/mlflow/mlflow/blob/branch-1.5/mlflow/store/model_registry/sqlalchemy_store.py#L34">SqlAlchemyStore</a></p></td>
</tr>
<tr class="odd">
<td>Plugins for running MLflow projects against custom execution
backends (e.g. to run projects against your team's in-house cluster or
job scheduler).</td>
<td>mlflow.project.backend</td>
<td>The entry point value (e.g.
<code>mlflow_test_plugin.dummy_backend:PluginDummyProjectBackend</code>)
specifies a custom subclass of
<code>mlflow.project.backend.AbstractBackend</code>)</td>
<td>N/A (will be added soon)</td>
</tr>
<tr class="even">
<td><p>Plugins for deploying models to custom serving tools.</p></td>
<td><p>mlflow.deployments</p></td>
<td><p>The entry point name (e.g. <code>redisai</code>) is the target
name. The entry point value (e.g.
<code>mlflow_test_plugin.fake_deployment_plugin</code>) specifies a
module defining:</p>
<p>1) Exactly one subclass of <a
href="python_api/mlflow.deployments.html#mlflow.deployments.BaseDeploymentClient">mlflow.deployments.BaseDeploymentClient</a>
(e.g., the <a
href="https://github.com/mlflow/mlflow/blob/master/tests/resources/mlflow-test-plugin/mlflow_test_plugin/fake_deployment_plugin.py">PluginDeploymentClient
class</a>). MLflow's <code>mlflow.deployments.get_deploy_client</code>
API directly returns an instance of this subclass to the user, so you're
encouraged to write clear user-facing method and class docstrings as
part of your plugin implementation.</p>
<p>1) The <code>run_local</code> and <code>target_help</code> functions,
with the <code>target</code> parameter excluded, as shown <a
href="https://github.com/mlflow/mlflow/blob/master/mlflow/deployments/base.py">here</a></p></td>
<td><p><a
href="https://github.com/mlflow/mlflow/blob/master/tests/resources/mlflow-test-plugin/mlflow_test_plugin/fake_deployment_plugin.py">PluginDeploymentClient</a>.</p></td>
</tr>
<tr class="odd">
<td><p>Plugins for <code class="interpreted-text"
role="ref">MLflow Model Evaluation &lt;model-evaluation&gt;</code></p></td>
<td><p>mlflow.model_evaluator</p></td>
<td><p>The entry point name (e.g. <code>dummy_evaluator</code>) is the
evaluator name which is used in the <code>evaluators</code> argument of
the <code>mlflow.evaluate</code> API. The entry point value (e.g.
<code>dummy_evaluator:DummyEvaluator</code>) must refer to a subclass of
<code>mlflow.models.evaluation.ModelEvaluator</code>; the subclass must
implement 2 methods:</p>
<p>1) <code>can_evaluate</code>: Accepts the keyword-only arguments
<code>model_type</code> and <code>evaluator_config</code>. Returns
<code>True</code> if the evaluator can evaluate the specified model type
with the specified evaluator config. Returns <code>False</code>
otherwise.</p>
<p>1) <code>evaluate</code>: Computes and logs metrics and artifacts,
returning evaluation results as an instance of
<code>mlflow.models.EvaluationResult</code>. Accepts the following
arguments: <code>model</code> (a pyfunc model instance),
<code>model_type</code> (identical to the <code>model_type</code>
argument from <code class="interpreted-text"
role="py:func">mlflow.evaluate()</code>), <code>dataset</code> (an
instance of
<code>mlflow.models.evaluation.base._EvaluationDataset</code> containing
features and labels (optional) for model evaluation),
<code>run_id</code> (the ID of the MLflow Run to which to log results),
and <code>evaluator_config</code> (a dictionary of additional
configurations for the evaluator).</p></td>
<td><p><a
href="https://github.com/mlflow/mlflow/blob/branch-1.23/tests/resources/mlflow-test-plugin/mlflow_test_plugin/dummy_evaluator.py">DummyEvaluator</a>.</p></td>
</tr>
<tr class="even">
<td>[Experimental] Plugins for custom mlflow server flask app
configuration <a
href="https://github.com/mlflow/mlflow/blob/v2.2.0/mlflow/server/__init__.py#L31">mlflow.server.app</a>.</td>
<td>mlflow.app</td>
<td>The entry point
<code>&lt;app_name&gt;=&lt;object_reference&gt;</code> (e.g.
<code>custom_app=mlflow_test_plugin.app:app</code>) specifies a
customized flask application. This can be useful for implementing
request hooks for authentication/authorization, custom logging and
custom flask configurations. The plugin must import <span
class="title-ref">mlflow.server.app</span> (e.g.
<code>from mlflow.server import app</code>) and may add custom
configuration, middleware etc. to the app. The plugin should avoid
altering the existing application routes, handlers and environment
variables to avoid unexpected behavior. Users who install the example
plugin will have a customized flask application. To run the customized
flask application, use
<code>mlflow server --app-name &lt;app_name&gt;</code>.</td>
<td><a
href="https://github.com/mlflow/mlflow/blob/v2.3.0/tests/resources/mlflow-test-plugin/mlflow_test_plugin/app.py">app</a>.</td>
</tr>
</tbody>
</table>

### Testing Your Plugin {#testing-your-plugin}

We recommend testing your plugin to ensure that it follows the contract
expected by MLflow. For example, a Tracking Store plugin should contain
tests verifying correctness of its `log_metric`, `log_param`, ... etc
implementations. See also the tests for MLflow's reference
implementations as an example:

-   [Example Tracking Store
    tests](https://github.com/mlflow/mlflow/blob/branch-1.5/tests/store/tracking/test_file_store.py)
-   [Example ArtifactRepository
    tests](https://github.com/mlflow/mlflow/blob/branch-1.5/tests/store/artifact/test_local_artifact_repo.py)
-   [Example RunContextProvider
    tests](https://github.com/mlflow/mlflow/blob/branch-1.5/tests/tracking/context/test_git_context.py)
-   [Example Model Registry Store
    tests](https://github.com/mlflow/mlflow/blob/branch-1.5/tests/store/model_registry/test_sqlalchemy_store.py)
-   [Example Custom MLflow Evaluator
    tests](https://github.com/mlflow/mlflow/blob/branch-1.23/tests/resources/mlflow-test-plugin/mlflow_test_plugin/dummy_evaluator.py)
-   [Example Custom MLflow server
    tests](https://github.com/mlflow/mlflow/blob/branch-2.2.0/tests/server/test_handlers.py)

### Distributing Your Plugin {#distributing-your-plugin}

Assuming you've structured your plugin similarly to the example plugin,
you can [distribute it via
PyPI](https://packaging.python.org/guides/distributing-packages-using-setuptools/).

Congrats, you've now written and distributed your own MLflow plugin!

## Community Plugins {#community-plugins}

### SQL Server Plugin {#sql-server-plugin}

The [mlflow-dbstore plugin](https://pypi.org/project/mlflow-dbstore/)
allows MLflow to use a relational database as an artifact store. As of
now, it has only been tested with SQL Server as the artifact store.

You can install MLflow with the SQL Server plugin via:

~~~ bash
pip install mlflow[sqlserver]
~~~

and then use MLflow as normal. The SQL Server artifact store support
will be provided automatically.

The plugin implements all of the MLflow artifact store APIs. To use SQL
server as an artifact store, a database URI must be provided, as shown
in the example below:

~~~ python
db_uri = "mssql+pyodbc://username:password@host:port/database?driver=ODBC+Driver+17+for+SQL+Server"

client.create_experiment(exp_name, artifact_location=db_uri)
mlflow.set_experiment(exp_name)

mlflow.onnx.log_model(onnx, "model")
~~~

The first time an artifact is logged in the artifact store, the plugin
automatically creates an `artifacts` table in the database specified by
the database URI and stores the artifact there as a BLOB. Subsequent
logged artifacts are stored in the same table.

In the example provided above, the `log_model` operation creates three
entries in the database table to store the ONNX model, the MLmodel file
and the conda.yaml file associated with the model.

### Aliyun(Alibaba Cloud) OSS Plugin {#aliyunalibaba-cloud-oss-plugin}

The [aliyunstoreplugin](https://pypi.org/project/aliyunstoreplugin/)
allows MLflow to use Alibaba Cloud OSS storage as an artifact store.

~~~ bash
pip install mlflow[aliyun-oss]
~~~

and then use MLflow as normal. The Alibaba Cloud OSS artifact store
support will be provided automatically.

The plugin implements all of the MLflow artifact store APIs. It expects
Aliyun Storage access credentials in the `MLFLOW_OSS_ENDPOINT_URL`,
`MLFLOW_OSS_KEY_ID` and `MLFLOW_OSS_KEY_SECRET` environment variables,
so you must set these variables on both your client application and your
MLflow tracking server. To use Aliyun OSS as an artifact store, an OSS
URI of the form `oss://<bucket>/<path>` must be provided, as shown in
the example below:

~~~ python
import mlflow
import mlflow.pyfunc


class Mod(mlflow.pyfunc.PythonModel):
    def predict(self, ctx, inp, params=None):
        return 7


exp_name = "myexp"
mlflow.create_experiment(exp_name, artifact_location="oss://mlflow-test/")
mlflow.set_experiment(exp_name)
mlflow.pyfunc.log_model("model_test", python_model=Mod())
~~~

In the example provided above, the `log_model` operation creates three
entries in the OSS storage
`oss://mlflow-test/$RUN_ID/artifacts/model_test/`, the MLmodel file and
the conda.yaml file associated with the model.

### XetHub Plugin {#xethub-plugin}

The [xethub plugin](https://pypi.org/project/mlflow-xethub/) allows
MLflow to use XetHub storage as an artifact store.

~~~ bash
pip install mlflow[xethub]
~~~

and then use MLflow as normal. The XetHub artifact store support will be
provided automatically.

The plugin implements all of the MLflow artifact store APIs. It expects
XetHub access credentials through `xet login` CLI command or in the
`XET_USER_EMAIL`, `XET_USER_NAME` and `XET_USER_TOKEN` environment
variables, so you must authenticate with XetHub for both your client
application and your MLflow tracking server. To use XetHub as an
artifact store, an XetHub URI of the form
`xet://<username>/<repo>/<branch/>` must be provided, as shown in the
example below:

~~~ python
import mlflow
import mlflow.pyfunc


class Mod(mlflow.pyfunc.PythonModel):
    def predict(self, ctx, inp, params=None):
        return 7


exp_name = "myexp"
mlflow.create_experiment(
    exp_name, artifact_location="xet://<your_username>/mlflow-test/main"
)
mlflow.set_experiment(exp_name)
mlflow.pyfunc.log_model("model_test", python_model=Mod())
~~~

In the example provided above, the `log_model` operation creates three
entries in the OSS storage
`xet://mlflow-test/$RUN_ID/artifacts/model_test/`, the MLmodel file and
the conda.yaml file associated with the model.

### Deployment Plugins {#deployment-plugins}

The following known plugins provide support for deploying models to
custom serving tools using MLflow's [model deployment
APIs](models.html#deployment-plugin). See the individual plugin pages
for installation instructions, and see the [Python API
docs](python_api/mlflow.deployments.html) and [CLI
docs](cli.html#mlflow-deployments) for usage instructions and examples.

-   [mlflow-redisai](https://github.com/RedisAI/mlflow-redisai)
-   [mlflow-torchserve](https://github.com/mlflow/mlflow-torchserve)
-   [mlflow-algorithmia](https://github.com/algorithmiaio/mlflow-algorithmia)
-   [mlflow-ray-serve](https://github.com/ray-project/mlflow-ray-serve)
-   [mlflow-azureml](https://docs.microsoft.com/en-us/azure/machine-learning/how-to-deploy-mlflow-models)
-   [oci-mlflow](https://github.com/oracle/oci-mlflow) Leverages Oracle
    Cloud Infrastructure (OCI) Model Deployment service for the
    deployment of MLflow models.

### Model Evaluation Plugins {#model-evaluation-plugins}

The following known plugins provide support for evaluating models with
custom validation tools using MLflow's [mlflow.evaluate()
API](models.html#model-evaluation):

-   [mlflow-giskard](https://docs.giskard.ai/en/latest/integrations/mlflow/index.html):
    Detect hidden vulnerabilities in ML models, from tabular to LLMs,
    before moving to production. Anticipate issues such as [Performance
    bias](https://docs.giskard.ai/en/latest/getting-started/key_vulnerabilities/performance_bias/index.html),
    [Unrobustness](https://docs.giskard.ai/en/latest/getting-started/key_vulnerabilities/robustness/index.html),
    [Overconfidence](https://docs.giskard.ai/en/latest/getting-started/key_vulnerabilities/overconfidence/index.html),
    [Underconfidence](https://docs.giskard.ai/en/latest/getting-started/key_vulnerabilities/underconfidence/index.html),
    [Ethical
    bias](https://docs.giskard.ai/en/latest/getting-started/key_vulnerabilities/ethics/index.html),
    [Data
    leakage](https://docs.giskard.ai/en/latest/getting-started/key_vulnerabilities/data_leakage/index.html),
    [Stochasticity](https://docs.giskard.ai/en/latest/getting-started/key_vulnerabilities/stochasticity/index.html),
    [Spurious
    correlation](https://docs.giskard.ai/en/latest/getting-started/key_vulnerabilities/spurious/index.html),
    and others. Conduct model comparisons using a wide range of tests,
    either through custom or domain-specific test suites.
-   [mlflow-trubrics](https://github.com/trubrics/trubrics-sdk/tree/main/trubrics/integrations/mlflow):
    validating ML models with Trubrics

### Project Backend Plugins {#project-backend-plugins}

The following known plugins provide support for running [MLflow
projects](https://www.mlflow.org/docs/latest/projects.html) against
custom execution backends.

-   [mlflow-yarn](https://github.com/criteo/mlflow-yarn) Running mlflow
    on Hadoop/YARN
-   [oci-mlflow](https://github.com/oracle/oci-mlflow) Running mlflow
    projects on Oracle Cloud Infrastructure (OCI)

### Tracking Store Plugins {#tracking-store-plugins}

The following known plugins provide support for running [MLflow Tracking
Store](https://www.mlflow.org/docs/latest/tracking.html) against custom
databases.

-   [mlflow-elasticsearchstore](https://github.com/criteo/mlflow-elasticsearchstore)
    Running MLflow Tracking Store with Elasticsearch

For additional information regarding this plugin, refer to
&lt;<https://github.com/criteo/mlflow-elasticsearchstore/issues>&gt;.
The library is available on PyPI here :
&lt;<https://pypi.org/project/mlflow-elasticsearchstore/>&gt;

### Artifact Repository Plugins {#artifact-repository-plugins}

-   [oci-mlflow](https://github.com/oracle/oci-mlflow) Leverages Oracle
    Cloud Infrastructure (OCI) Object Storage service to store MLflow
    models artifacts.
