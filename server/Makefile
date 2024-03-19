.PHONY: init generate fix_generate run build

BINARY_NAME=server

run:build
	cd build && ./${BINARY_NAME}-debug.exe

run_direct:
	cd build && ./${BINARY_NAME}-debug.exe

build:
	if [ ! -d "build" ]; then mkdir build; fi
	GOARCH=amd64 GOOS=windows go build -o build/${BINARY_NAME}-debug.exe main.go

init:
	go run github.com/99designs/gqlgen init

generate:
	go run github.com/99designs/gqlgen generate

fix_generate:
	go get github.com/99designs/gqlgen/codegen/config@v0.17.45
	go get github.com/99designs/gqlgen/internal/imports@v0.17.45
	go get github.com/99designs/gqlgen@v0.17.45