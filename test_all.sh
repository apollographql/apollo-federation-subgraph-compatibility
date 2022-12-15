#!/usr/bin/env sh

# generate all subgraph results
for dir in implementations/*
do
  if [[ $dir != *_ ]];
  then
    impl="${dir##*/}"
    echo "${impl}"

    npm run compatibility:test -- docker --debug --compose implementations/${impl}/docker-compose.yaml --schema implementations/_template_library_/products.graphql --format json
    jq -s '.[0] + {tests: .[1]}' implementations/${impl}/metadata.json results.json > results_${impl}.json
  fi
done

# merge results into single file
jq -s . results_*.json > final_results.json

npm run compatibility:report -- final_results.json
