FROM ruby:3.2
WORKDIR /web
COPY ./Gemfile* /web/
RUN bundle
COPY . /web
CMD ["bundle", "exec", "rackup", "--host", "0.0.0.0", "--port", "4001"]
