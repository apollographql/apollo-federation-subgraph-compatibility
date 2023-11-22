#!/usr/bin/env sh

# generate all subgraph results
for dir in implementations/*
do
  if [[ $dir != *_ || $dir != "appsync" || $dir != "stepzen" ]];
  then
    impl="${dir##*/}"
    echo "${impl}"

    npm run compatibility:test -- docker --debug --compose implementations/${impl}/docker-compose.yaml --schema implementations/_template_library_/products.graphql --format json
    jq -s '.[0] + .[1] + {tests: .[2]}' implementations/${impl}/github_metadata.json implementations/${impl}/metadata.json results.json > results-${impl}.json
  fi
done

# # merge results into single file
jq -s . results*.json > final_results.json
npm run compatibility:report -- final_results.json
