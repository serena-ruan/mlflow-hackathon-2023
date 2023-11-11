# Search Experiments {#search-experiments}

`mlflow.search_experiments` and
`MlflowClient.search_experiments() <mlflow.client.MlflowClient.search_experiments>`
support the same filter string syntax as `mlflow.search_runs` and
`MlflowClient.search_runs() <mlflow.client.MlflowClient.search_runs>`,
but the supported identifiers and comparators are different.

<div class="contents" markdown="1" local="" depth="3">

Table of Contents

</div>

## Syntax {#syntax}

See `Search Runs Syntax <search-runs-syntax>` for more information.

### Identifier {#identifier}

The following identifiers are supported:

-   `attributes.name`: Experiment name

-   `attributes.creation_time`: Experiment creation time

-   `attributes.last_update_time`: Experiment last update time

    > <div class="note" markdown="1">
    >
    > <div class="title" markdown="1">
    >
    > Note
    >
    > </div>
    >
    > `attributes` can be omitted. `name` is equivalent to
    > `attributes.name`.
    >
    > </div>

-   `tags.<tag key>`: Tag

### Comparator {#comparator}

Comparators for string attributes and tags:

-   `=`: Equal
-   `!=`: Not equal
-   `LIKE`: Case-sensitive pattern match
-   `ILIKE`: Case-insensitive pattern match

Comparators for numeric attributes:

-   `=`: Equal
-   `!=`: Not equal
-   `<`: Less than
-   `<=`: Less than or equal to
-   `>`: Greater than
-   `>=`: Greater than or equal to

### Examples {#examples}

~~~ python
# Matches experiments with name equal to 'x'
"attributes.name = 'x'"  # or "name = 'x'"

# Matches experiments with name starting with 'x'
"attributes.name LIKE 'x%'"

# Matches experiments with 'group' tag value not equal to 'x'
"tags.group != 'x'"

# Matches experiments with 'group' tag value containing 'x' or 'X'
"tags.group ILIKE '%x%'"

# Matches experiments with name starting with 'x' and 'group' tag value equal to 'y'
"attributes.name LIKE 'x%' AND tags.group = 'y'"
~~~
