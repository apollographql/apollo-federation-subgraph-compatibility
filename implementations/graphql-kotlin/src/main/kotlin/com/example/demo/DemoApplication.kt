package com.example.demo

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import org.springframework.context.annotation.Bean
import org.springframework.web.server.WebFilter

@SpringBootApplication
class DemoApplication {

    @Bean
    fun corsFilter(): WebFilter = WebFilter { exchange, chain ->
        exchange.response.headers.add("Access-Control-Allow-Origin", "*")
        exchange.response.headers.add("Access-Control-Allow-Method", "GET, POST")
        exchange.response.headers.add("Access-Control-Allow-Headers", "content-type")
        chain.filter(exchange)
    }
}

fun main(args: Array<String>) {
    runApplication<DemoApplication>(*args)
}
