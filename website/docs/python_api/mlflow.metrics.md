# mlflow.metrics {#mlflow.metrics}

The `mlflow.metrics` module helps you quantitatively and qualitatively
measure your models.

<div class="autoclass" markdown="1">

mlflow.metrics.EvaluationMetric

</div>

These `EvaluationMetric <mlflow.metrics.EvaluationMetric>` are used by
the `mlflow.evaluate()` API, either computed automatically depending on
the `model_type` or specified via the `extra_metrics` parameter.

The following code demonstrates how to use `mlflow.evaluate()` with an
`EvaluationMetric <mlflow.metrics.EvaluationMetric>`.

~~~ python
import mlflow
from mlflow.metrics.genai import EvaluationExample, answer_similarity

eval_df = pd.DataFrame(
    {
        "inputs": [
            "What is MLflow?",
        ],
        "ground_truth": [
            "MLflow is an open-source platform for managing the end-to-end machine learning lifecycle. It was developed by Databricks, a company that specializes in big data and machine learning solutions. MLflow is designed to address the challenges that data scientists and machine learning engineers face when developing, training, and deploying machine learning models.",
        ],
    }
)

example = EvaluationExample(
    input="What is MLflow?",
    output="MLflow is an open-source platform for managing machine "
    "learning workflows, including experiment tracking, model packaging, "
    "versioning, and deployment, simplifying the ML lifecycle.",
    score=4,
    justification="The definition effectively explains what MLflow is "
    "its purpose, and its developer. It could be more concise for a 5-score.",
    grading_context={
        "ground_truth": "MLflow is an open-source platform for managing "
        "the end-to-end machine learning (ML) lifecycle. It was developed by Databricks, "
        "a company that specializes in big data and machine learning solutions. MLflow is "
        "designed to address the challenges that data scientists and machine learning "
        "engineers face when developing, training, and deploying machine learning models."
    },
)
answer_similarity_metric = answer_similarity(examples=[example])
results = mlflow.evaluate(
    logged_model.model_uri,
    eval_df,
    targets="ground_truth",
    model_type="question-answering",
    extra_metrics=[answer_similarity_metric],
)
~~~

Evaluation results are stored as
`MetricValue <mlflow.metrics.MetricValue>`. Aggregate results are logged
to the MLflow run as metrics, while per-example results are logged to
the MLflow run as artifacts in the form of an evaluation table.

<div class="autoclass" markdown="1">

mlflow.metrics.MetricValue

</div>

We provide the following builtin factory functions to create
`EvaluationMetric <mlflow.metrics.EvaluationMetric>` for evaluating
models. These metrics are computed automatically depending on the
`model_type`. For more information on the `model_type` parameter, see
`mlflow.evaluate()` API.

<div class="autofunction" markdown="1">

mlflow.metrics.mae

</div>

<div class="autofunction" markdown="1">

mlflow.metrics.mape

</div>

<div class="autofunction" markdown="1">

mlflow.metrics.max_error

</div>

<div class="autofunction" markdown="1">

mlflow.metrics.mse

</div>

<div class="autofunction" markdown="1">

mlflow.metrics.rmse

</div>

<div class="autofunction" markdown="1">

mlflow.metrics.r2_score

</div>

<div class="autofunction" markdown="1">

mlflow.metrics.precision_score

</div>

<div class="autofunction" markdown="1">

mlflow.metrics.recall_score

</div>

<div class="autofunction" markdown="1">

mlflow.metrics.f1_score

</div>

<div class="autofunction" markdown="1">

mlflow.metrics.ari_grade_level

</div>

<div class="autofunction" markdown="1">

mlflow.metrics.flesch_kincaid_grade_level

</div>

<div class="autofunction" markdown="1">

mlflow.metrics.exact_match

</div>

<div class="autofunction" markdown="1">

mlflow.metrics.rouge1

</div>

<div class="autofunction" markdown="1">

mlflow.metrics.rouge2

</div>

<div class="autofunction" markdown="1">

mlflow.metrics.rougeL

</div>

<div class="autofunction" markdown="1">

mlflow.metrics.rougeLsum

</div>

<div class="autofunction" markdown="1">

mlflow.metrics.toxicity

</div>

<div class="autofunction" markdown="1">

mlflow.metrics.token_count

</div>

<div class="autofunction" markdown="1">

mlflow.metrics.latency

</div>

## Retriever Metrics {#retriever-metrics}

The following metrics are built-in metrics for the `'retriever'` model
type, meaning they will be automatically calculated with a default
`retriever_k` value of 3.

To evaluate document retrieval models, it is recommended to use a
dataset with the following columns:

-   Input queries
-   Retrieved relevant doc IDs
-   Ground-truth doc IDs

Alternatively, you can also provide a function through the `model`
parameter to represent your retrieval model. The function should take a
Pandas DataFrame containing input queries and ground-truth relevant doc
IDs, and return a DataFrame with a column of retrieved relevant doc IDs.

A "doc ID" is a string that uniquely identifies a document. Each row of
the retrieved and ground-truth doc ID columns should consist of a list
of doc IDs.

Parameters:

-   `targets`: A string specifying the column name of the ground-truth
    relevant doc IDs

-   `predictions`: A string specifying the column name of the retrieved
    relevant doc IDs in either the static dataset or the Dataframe
    returned by the `model` function

-   `retriever_k`: A positive integer specifying the number of retrieved
    docs IDs to consider for each input query. `retriever_k` defaults
    to 3. You can change `retriever_k` by using the `mlflow.evaluate`
    API:

    > 1.  ~~~ python
    >     # with a model and using `evaluator_config`
    >     mlflow.evaluate(
    >         model=retriever_function,
    >         data=data,
    >         targets="ground_truth",
    >         model_type="retriever",
    >         evaluators="default",
    >         evaluator_config={"retriever_k": 5}
    >     )
    >     ~~~
    >
    > 2.  ~~~ python
    >     # with a static dataset and using `extra_metrics`
    >     mlflow.evaluate(
    >         data=data,
    >         predictions="retrieved_docs",
    >         targets="ground_truth_docs",
    >         predictions="predictions_param",
    >         targets="targets_param",
    >         model_type="retriever",
    >         extra_metrics = [
    >             mlflow.metrics.precision_at_k(5),
    >             mlflow.metrics.precision_at_k(6),
    >             mlflow.metrics.recall_at_k(4),
    >             mlflow.metrics.recall_at_k(5)
    >         ]   
    >     )
    >     ~~~
    >
    > NOTE: In the 2nd method, it is recommended to omit the
    > `model_type` as well, or else `precision@3` and `recall@3` will be
    > calculated in addition to `precision@5`, `precision@6`,
    > `recall@4`, and `recall@5`.

<div class="autofunction" markdown="1">

mlflow.metrics.precision_at_k

</div>

<div class="autofunction" markdown="1">

mlflow.metrics.recall_at_k

</div>

Users create their own
`EvaluationMetric <mlflow.metrics.EvaluationMetric>` using the
`make_metric <mlflow.metrics.make_metric>` factory function

<div class="autofunction" markdown="1">

mlflow.metrics.make_metric

</div>

<div class="automodule" markdown="1" members="" undoc-members=""
show-inheritance=""
exclude-members="MetricValue, EvaluationMetric, make_metric, EvaluationExample, ari_grade_level, flesch_kincaid_grade_level, exact_match, rouge1, rouge2, rougeL, rougeLsum, toxicity, answer_similarity, answer_correctness, faithfulness, answer_relevance, mae, mape, max_error, mse, rmse, r2_score, precision_score, recall_score, f1_score, token_count, latency, precision_at_k, recall_at_k">

mlflow.metrics

</div>

### Generative AI Metrics {#generative-ai-metrics}

We also provide generative AI ("genai")
`EvaluationMetric <mlflow.metrics.EvaluationMetric>`s for evaluating
text models. These metrics use an LLM to evaluate the quality of a
model's output text. Note that your use of a third party LLM service
(e.g., OpenAI) for evaluation may be subject to and governed by the LLM
service's terms of use. The following factory functions help you
customize the intelligent metric to your use case.

<div class="automodule" markdown="1" members="" undoc-members=""
show-inheritance=""
exclude-members="EvaluationExample, make_genai_metric">

mlflow.metrics.genai

</div>

You can also create your own generative AI
`EvaluationMetric <mlflow.metrics.EvaluationMetric>`s using the
`make_genai_metric <mlflow.metrics.genai.make_genai_metric>` factory
function.

<div class="autofunction" markdown="1">

mlflow.metrics.genai.make_genai_metric

</div>

When using generative AI
`EvaluationMetric <mlflow.metrics.EvaluationMetric>`s, it is important
to pass in an
`EvaluationExample <mlflow.metrics.genai.EvaluationExample>`

<div class="autoclass" markdown="1">

mlflow.metrics.genai.EvaluationExample

</div>
