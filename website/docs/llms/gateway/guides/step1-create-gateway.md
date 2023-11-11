# Configuring and Starting the AI Gateway {#configuring-and-starting-the-ai-gateway}

## Step 1: Install {#step-1-install}

First, install MLflow along with the gateway extras to get access to a
range of serving-related dependencies, including `uvicorn` and
`fastapi`. Note that direct dependencies on OpenAI are unnecessary, as
all supported providers are abstracted from the developer.

<div class="code-section" markdown="1">

~~~ bash
pip install 'mlflow[gateway]' 
~~~

</div>

## Step 2: Set the OpenAI Token as an Environment Variable {#step-2-set-the-openai-token-as-an-environment-variable}

Next, set the OpenAI API key as an environment variable in your CLI.

This approach allows the MLflow AI Gateway to read the sensitive API key
safely, reducing the risk of leaking the token in code. The AI Gateway,
when started, will read the value set by this environment variable
without any additional action required.

<div class="code-section" markdown="1">

~~~ bash
export OPENAI_API_KEY=your_api_key_here
~~~

</div>

## Step 3: Configure the Gateway {#step-3-configure-the-gateway}

Third, set up several routes for the gateway to host. The configuration
of the AI Gateway is done through editing a YAML file that is read by
the server initialization command (covered in step 4).

Notably, the AI Gateway allows real-time updates to an active gateway
through the YAML configuration; service restart is not required for
changes to take effect and can instead be done simply by editing the
configuration file that is defined at server start, permitting dynamic
route creation without downtime of the service.

<div class="code-section" markdown="1">

~~~ yaml
routes:
- name: my_completions_route
    route_type: llm/v1/completions
    model:
        provider: openai
        name: gpt-3.5-turbo
        config:
            openai_api_key: $OPENAI_API_KEY

- name: my_chat_route_gpt_4
    route_type: llm/v1/chat
    model:
        provider: openai
        name: gpt-4
        config:
            openai_api_key: $OPENAI_API_KEY

- name: my_chat_route_gpt_3.5_turbo
    route_type: llm/v1/chat
    model:
        provider: openai
        name: gpt-3.5-turbo
        config:
            openai_api_key: $OPENAI_API_KEY

- name: my_embeddings_route
    route_type: llm/v1/embeddings
    model:
        provider: openai
        name: text-embedding-ada-002
        config:
            openai_api_key: $OPENAI_API_KEY
~~~

</div>

## Step 4: Start the Gateway {#step-4-start-the-gateway}

Fourth, let's test the gateway service!

To launch the gateway using a YAML config file, use the gateway CLI
command.

The gateway will automatically start on `localhost` at port `5000`,
accessible via the URL: `http://localhost:5000`. To modify these default
settings, use the `mlflow gateway --help` command to view additional
configuration options.

<div class="code-section" markdown="1">

~~~ bash
mlflow gateway start --config-path config.yaml 
~~~

</div>

<figure>
<img
src="../../../../static/images/tutorials/gateway/creating-first-gateway/start_gateway.gif"
class="align-center" width="800"
alt="../../../../static/images/tutorials/gateway/creating-first-gateway/start_gateway.gif" />
</figure>

<div class="note" markdown="1">

<div class="title" markdown="1">

Note

</div>

MLflow AI Gateway automatically creates API docs. You can validate your
gateway is running by viewing the docs. Go to
`http://{host}:{port}` in your web browser.

</div>
