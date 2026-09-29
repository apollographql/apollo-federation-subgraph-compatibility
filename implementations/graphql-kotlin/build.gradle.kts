import org.jetbrains.kotlin.gradle.dsl.JvmTarget

plugins {
	id("org.springframework.boot") version "4.1.1"
	kotlin("jvm") version "2.4.20"
	kotlin("plugin.spring") version "2.4.20"
}

group = "com.example"
version = "0.0.1-SNAPSHOT"

java {
	sourceCompatibility = JavaVersion.VERSION_25
}

repositories {
	mavenCentral()
}

dependencies {
	implementation("org.jetbrains.kotlin:kotlin-reflect")
	implementation("com.expediagroup:graphql-kotlin-spring-server:10.2.2")
}

kotlin {
	compilerOptions {
		freeCompilerArgs.addAll("-Xjsr305=strict")
		jvmTarget.set(JvmTarget.JVM_25)
	}
}

tasks.withType<Test> {
	useJUnitPlatform()
}
