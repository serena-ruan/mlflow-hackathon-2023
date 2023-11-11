orphan

:   

# Supported `messages` formats for OpenAI chat completion task {#mlflow.openai.messages}

This document covers the following:

-   Supported `messages` formats for OpenAI chat completion task in the
    `openai` flavor.
-   Logged model signature for each format.
-   Payload sent to OpenAI chat completion API for each format.
-   Expected prediction input types for each format.

## `messages` with variables {#messages-with-variables}

The `messages` argument accepts a list of dictionaries with `role` and
`content` keys. The `content` field in each message can contain
variables (= named format fields). When the logged model is loaded and
makes a prediction, the variables are replaced with the values from the
prediction input.

### Single variable {#single-variable}

~~~ python
import mlflow
import openai

with mlflow.start_run():
    model_info = mlflow.openai.log_model(
        artifact_path="model",
        model="gpt-3.5-turbo",
        task=openai.ChatCompletion,
        messages=[
            {
                "role": "user",
                "content": "Tell me a {adjective} joke",
                #                     ^^^^^^^^^^
                #                     variable
            },
            # Can contain more messages
        ],
    )

model = mlflow.pyfunc.load_model(model_info.model_uri)
print(model.predict([{"adjective": "funny"}]))
~~~

Logged model signature:

~~~ python
{
    "inputs": [{"type": "string"}],
    "outputs": [{"type": "string"}],
}
~~~

Expected prediction input types:

~~~ python
# A list of dictionaries with 'adjective' key
[{"adjective": "funny"}, ...]

# A list of strings
["funny", ...]
~~~

Payload sent to OpenAI chat completion API:

~~~ python
{
    "model": "gpt-3.5-turbo",
    "messages": [
        {
            "role": "user",
            "content": "Tell me a funny joke",
        }
    ],
}
~~~

### Multiple variables {#multiple-variables}

~~~ python
import mlflow
import openai

with mlflow.start_run():
    model_info = mlflow.openai.log_model(
        artifact_path="model",
        model="gpt-3.5-turbo",
        task=openai.ChatCompletion,
        messages=[
            {
                "role": "user",
                "content": "Tell me a {adjective} joke about {thing}.",
                #                     ^^^^^^^^^^             ^^^^^^^
                #                     variable               another variable
            },
            # Can contain more messages
        ],
    )

model = mlflow.pyfunc.load_model(model_info.model_uri)
print(model.predict([{"adjective": "funny", "thing": "vim"}]))
~~~

Logged model signature:

~~~ python
{
    "inputs": [
        {"name": "adjective", "type": "string"},
        {"name": "thing", "type": "string"},
    ],
    "outputs": [{"type": "string"}],
}
~~~

Expected prediction input types:

~~~ python
# A list of dictionaries with 'adjective' and 'thing' keys
[{"adjective": "funny", "thing": "vim"}, ...]
~~~

Payload sent to OpenAI chat completion API:

~~~ python
{
    "model": "gpt-3.5-turbo",
    "messages": [
        {
            "role": "user",
            "content": "Tell me a funny joke about vim",
        }
    ],
}
~~~

## `messages` without variables {#messages-without-variables}

If no variables are provided, the prediction input will be
appended to the logged `messages` with `role = user`.

~~~ python
with mlflow.start_run():
    model_info = mlflow.openai.log_model(
        artifact_path="model",
        model="gpt-3.5-turbo",
        task=openai.ChatCompletion,
        messages=[
            {
                "role": "system",
                "content": "You're a frontend engineer.",
            }
        ],
    )

model = mlflow.pyfunc.load_model(model_info.model_uri)
print(model.predict(["Tell me a funny joke."]))
~~~

Logged model signature:

~~~ python
{
    "inputs": [{"type": "string"}],
    "outputs": [{"type": "string"}],
}
~~~

Expected prediction input type:

-   A list of dictionaries with a single key
-   A list of strings

Payload sent to OpenAI chat completion API:

~~~ python
{
    "model": "gpt-3.5-turbo",
    "messages": [
        {
            "role": "system",
            "content": "You're a frontend engineer.",
        },
        {
            "role": "user",
            "content": "Tell me a funny joke.",
        },
    ],
}
~~~

## No `messages` {#no-messages}

The `messages` argument is optional and can be omitted. If omitted, the
prediction input will be sent to the OpenAI chat completion API as-is
with `role = user`.

~~~ python
import mlflow
import openai

with mlflow.start_run():
    model_info = mlflow.openai.log_model(
        artifact_path="model",
        model="gpt-3.5-turbo",
        task=openai.ChatCompletion,
    )

model = mlflow.pyfunc.load_model(model_info.model_uri)
print(model.predict(["Tell me a funny joke."]))
~~~

Logged model signature:

~~~ python
{
    "inputs": [{"type": "string"}],
    "outputs": [{"type": "string"}],
}
~~~

Expected prediction input types:

~~~ python
# A list of dictionaries with a single key
[{"<any key>": "Tell me a funny joke."}, ...]

# A list of strings
["Tell me a funny joke.", ...]
~~~

Payload sent to OpenAI chat completion API:

~~~ python
{
    "model": "gpt-3.5-turbo",
    "messages": [
        {
            "role": "user",
            "content": "Tell me a funny joke.",
        }
    ],
}
~~~
