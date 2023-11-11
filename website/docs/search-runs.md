# Search Runs {#search-runs}

The MLflow UI and API support searching runs within a single experiment
or a group of experiments using a search filter API. This API is a
simplified version of the SQL `WHERE` clause.

<div class="contents" markdown="1" local="" depth="3">

Table of Contents

</div>

## Syntax {#search-runs-syntax}

A search filter is one or more expressions joined by the `AND` keyword.
The syntax does not support `OR`. Each expression has three parts: an
identifier on the left-hand side (LHS), a comparator, and constant on
the right-hand side (RHS).

### Example Expressions {#example-expressions}

-   Search for the subset of runs with logged accuracy metric greater
    than 0.92.

    ~~~ sql
    metrics.accuracy > 0.92
    ~~~

-   Search for all completed runs.

    ~~~ sql
    attributes.status = "FINISHED"
    ~~~

-   Search for all failed runs.

    ~~~ sql
    attributes.status = "FAILED"
    ~~~

-   Search for runs created after UNIX timestamp `1670628787527`.

    ~~~ sql
    attributes.created > 1670628787527
    attributes.Created > 1670628787527
    attributes.start_time > 1670628787527
    ~~~

-   Search for the subset of runs with F1 score greater than 0.5.

    ~~~ sql
    metrics.`f1 score` > 0.5
    ~~~

-   Search for runs created by user '<john@mlflow.com>'.

    ~~~ sql
    tags.`mlflow.user` = 'john@mlflow.com'
    ~~~

-   Search for runs with models trained using scikit-learn (assumes runs
    have a tag called `model` whose value starts with `sklearn`).

    ~~~ sql
    tags.`model` LIKE 'sklearn%'
    ~~~

-   Search for runs with logistic regression models, ignoring case
    (assumes runs have a tag called `type` whose value contains
    `logistic`).

    ~~~ sql
    tags.`type` ILIKE '%Logistic%'
    ~~~

-   Search for runs whose names contain `alpha`.

    ~~~ sql
    attributes.`run_name` ILIKE "%alpha%"
    attributes.`run name` ILIKE "%alpha%"
    attributes.`Run name` ILIKE "%alpha%"
    attributes.`Run Name` ILIKE "%alpha%"
    ~~~

-   Search for runs created using a Logistic Regression model, a
    learning rate (lambda) of 0.001, and recorded error metric under
    0.05.

    ~~~ sql
    params.alpha = "0.3" and params.lambda = "0.001" and metrics.error <= 0.05
    ~~~

### Identifier {#identifier}

Required in the LHS of a search expression. Signifies an entity to
compare against.

An identifier has two parts separated by a period: the type of the
entity and the name of the entity. The type of the entity is `metrics`,
`params`, `attributes`, `datasets`, or `tags`. The entity name can
contain alphanumeric characters and special characters.

This section describes supported entity names and how to specify such
names in search expressions.

<div class="contents" markdown="1" local="" depth="1">

In this section:

</div>

#### Entity Names Containing Special Characters {#entity-names-containing-special-characters}

When a metric, parameter, or tag name contains a special character like
hyphen, space, period, and so on, enclose the entity name in double
quotes or backticks.

**Examples**

~~~ sql
params."model-type"
~~~

~~~ sql
metrics.`error rate`
~~~

#### Entity Names Starting with a Number {#entity-names-starting-with-a-number}

Unlike SQL syntax for column names, MLflow allows logging metrics,
parameters, and tags names that have a leading number. If an entity name
contains a leading number, enclose the entity name in double quotes. For
example:

~~~ sql
metrics."2019-04-02 error rate"
~~~

#### Run Attributes {#run-attributes}

You can search using the following run attributes contained in
`mlflow.entities.RunInfo`: `run_id`, `run_name`, `status`,
`artifact_uri`, `user_id`, `start_time` and `end_time`. The `run_id`,
`run_name`, `status`, `user_id` and `artifact_uri` attributes have
string values, while `start_time` and `end_time` are numeric. Other
fields in `mlflow.entities.RunInfo` are not searchable.

`Run name`, `Run Name` and `run name` are aliases for `run_name`.
`created` and `Created` are aliases for `start_time`.

<div class="note" markdown="1">

<div class="title" markdown="1">

Note

</div>

-   The experiment ID is implicitly selected by the search API.
-   A run's `lifecycle_stage` attribute is not allowed because it is
    already encoded as a part of the API's `run_view_type` field. To
    search for runs using `run_id`, it is more efficient to use
    `get_run` APIs.

</div>

**Example**

~~~ sql
attributes.artifact_uri = 'models:/mymodel/1'
attributes.status = 'ACTIVE'
# RHS value for start_time and end_time are unix timestamp
attributes.start_time >= 1664067852747
attributes.end_time < 1664067852747
attributes.user_id = 'user1'
attributes.run_name = 'my-run'
attributes.run_id = 'a1b2c3d4'
attributes.run_id IN ('a1b2c3d4', 'e5f6g7h8')
~~~

#### Datasets {#datasets}

You can search using the following dataset attributes contained in
`mlflow.entities.Dataset`: `name`, `digest`. Additionally, you may
search for a specific `mlflow.entities.InputTag`: with `key`
`mlflow.data.context` under the alias `context`. All dataset attributes
are string values. Other fields in `mlflow.entities.Dataset` are not
searchable.

**Example**

~~~ sql
datasets.name = 'mydataset'
datasets.digest = 's8ds293b'
datasets.digest IN ('s8ds293b', 'jks834s2')
datasets.context = 'train'
~~~

#### MLflow Tags {#mlflow_tags}

You can search for MLflow tags by enclosing the tag name in double
quotes or backticks. For example, to search by owner of an MLflow run,
specify `tags."mlflow.user"` or `` tags.`mlflow.user ``\`.

**Examples**

~~~ sql
tags."mlflow.user"
~~~

~~~ sql
tags.`mlflow.parentRunId`
~~~

### Comparator {#comparator}

There are two classes of comparators: numeric and string.

-   Numeric comparators (`metrics`): `=`, `!=`, `>`, `>=`, `<`, and
    `<=`.
-   String comparators (`params`, `tags`, and `attributes`): `=`, `!=`,
    `LIKE` and `ILIKE`.

### Constant {#constant}

The search syntax requires the RHS of the expression to be a constant.
The type of the constant depends on LHS.

-   If LHS is a metric, the RHS must be an integer or float number.
-   If LHS is a parameter or tag, the RHS must be a string constant
    enclosed in single or double quotes.

## Programmatically Searching Runs {#programmatically-searching-runs}

The MLflow UI supports searching runs contained within the current
experiment. To search runs across multiple experiments, use one of the
client APIs.

### Python {#python}

Use the
`MlflowClient.search_runs() <mlflow.client.MlflowClient.search_runs>` or
`mlflow.search_runs` API to search programmatically. You can specify the
list of columns to order by (for example, "metrics.rmse") in the
`order_by` column. The column can contain an optional `DESC` or `ASC`
value; the default is `ASC`. The default ordering is to sort by
`start_time DESC`, then `run_id`.

The `mlflow.search_runs` API can be used to search for runs within
specific experiments which can be identified by experiment IDs or
experiment names, but not both at the same time.

<div class="warning" markdown="1">

<div class="title" markdown="1">

Warning

</div>

Using both `experiment_ids` and `experiment_names` in the same call will
result in error unless one of them is `None` or `[]`

</div>

For example, if you'd like to identify the best
`active` run from experiment ID 0 by
accuracy, use:

~~~ python
from mlflow import MlflowClient
from mlflow.entities import ViewType

run = MlflowClient().search_runs(
    experiment_ids="0",
    filter_string="",
    run_view_type=ViewType.ACTIVE_ONLY,
    max_results=1,
    order_by=["metrics.accuracy DESC"],
)[0]
~~~

To get all active runs from experiments IDs 3, 4, and 17 that used a CNN
model with 10 layers and had a prediction accuracy of 94.5% or higher,
use:

~~~ python
from mlflow import MlflowClient
from mlflow.entities import ViewType

query = "params.model = 'CNN' and params.layers = '10' and metrics.`prediction accuracy` >= 0.945"
runs = MlflowClient().search_runs(
    experiment_ids=["3", "4", "17"],
    filter_string=query,
    run_view_type=ViewType.ACTIVE_ONLY,
)
~~~

To search all known experiments for any MLflow runs created using the
Inception model architecture:

~~~ python
import mlflow
from mlflow.entities import ViewType

all_experiments = [exp.experiment_id for exp in mlflow.search_experiments()]
runs = mlflow.search_runs(
    experiment_ids=all_experiments,
    filter_string="params.model = 'Inception'",
    run_view_type=ViewType.ALL,
)
~~~

To get all runs from the experiment named "Social NLP Experiments", use:

~~~ python
import mlflow

runs = mlflow.search_runs(experiment_names=["Social NLP Experiments"])
~~~

### R {#r}

The R API is similar to the Python API.

~~~ r
library(mlflow)
mlflow_search_runs(
  filter = "metrics.rmse < 0.9 and tags.production = 'true'",
  experiment_ids = as.character(1:2),
  order_by = "params.lr DESC"
)
~~~

### Java {#java}

The Java API is similar to Python API.

~~~ java
List<Long> experimentIds = Arrays.asList("1", "2", "4", "8");
List<RunInfo> searchResult = client.searchRuns(experimentIds, "metrics.accuracy_score < 99.90");
~~~