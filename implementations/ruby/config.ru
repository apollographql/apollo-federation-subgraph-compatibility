require_relative "./server.rb"

use Rack::ShowExceptions
run GraphQLServer
