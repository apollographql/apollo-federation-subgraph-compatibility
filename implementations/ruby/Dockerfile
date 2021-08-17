FROM ruby:latest
WORKDIR /web
COPY ./Gemfile* /web/
RUN bundle
COPY . /web
CMD ["bundle", "exec", "rackup", "--host", "0.0.0.0", "--port", "4001"]
