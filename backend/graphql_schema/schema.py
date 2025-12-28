"""
Strawberry GraphQL Schema
Combines queries and mutations
"""

import strawberry
from graphql_schema.queries import Query
from graphql_schema.mutations import Mutation


# Create the GraphQL schema
schema = strawberry.Schema(
    query=Query,
    mutation=Mutation
)
