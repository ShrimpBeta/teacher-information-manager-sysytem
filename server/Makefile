.PHONY: init generate fix_generate

init:
	go run github.com/99designs/gqlgen init

generate:
	go run github.com/99designs/gqlgen generate

fix_generate:
	go get github.com/99designs/gqlgen/codegen/config@v0.17.45
	go get github.com/99designs/gqlgen/internal/imports@v0.17.45
	go get github.com/99designs/gqlgen@v0.17.45