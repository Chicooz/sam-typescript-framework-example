DEV_STACK_NAME = exampleapp-dev
PROD_STACK_NAME = exampleapp-prod
DEV_S3_BUCKET_NAME = exampleapp-user-avatars-dev
PROD_S3_BUCKET_NAME = exampleapp-user-avatars-prod

validate:
	sam validate && swagger-cli validate swagger/exampleapp-api-docs.yaml

build:
	sam build --cached --parallel --beta-features

test: clean
	npm run test

start-local-dev: build
	sam local start-api \
		--parameter-overrides \
			EnvironmentType=Dev \
			ParameterPrefix=exampleapp \

start-local-prod: build
	sam local start-api \
		--parameter-overrides \
			EnvironmentType=Prod \
			ParameterPrefix=exampleapp

invoke: build
	sam local invoke

clean:
	rm -rf .aws-sam/

deploy-dev: build
	sam deploy \
		--stack-name $(DEV_STACK_NAME) \
		--resolve-s3 \
		--no-confirm-changeset \
		--no-fail-on-empty-changeset \
		--capabilities CAPABILITY_IAM \
		--parameter-overrides \
			EnvironmentType=Dev \
			S3BucketName=$(DEV_S3_BUCKET_NAME) \
			ParameterPrefix=exampleapp

deploy-prod: build
		sam deploy \
			--stack-name $(PROD_STACK_NAME) \
			--resolve-s3 \
			--no-confirm-changeset \
			--no-fail-on-empty-changeset \
			--capabilities CAPABILITY_IAM \
			--parameter-overrides \
				EnvironmentType=Prod \
				S3BucketName=$(PROD_S3_BUCKET_NAME) \
				ParameterPrefix=exampleapp

destroy-dev:
	aws cloudformation delete-stack \
		--stack-name $(DEV_STACK_NAME)

destroy-prod:
		aws cloudformation delete-stack \
			--stack-name $(PROD_STACK_NAME)

act-test:
	act pull_request \
		--container-architecture linux/amd64 \
		-s DEV_AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID} \
		-s DEV_AWS_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY}

act-deploy-dev: validate
	@act --container-architecture linux/amd64 \
		-s DEV_AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID} \
		-s DEV_AWS_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY}

act-deploy-prod: validate
	@act --container-architecture linux/amd64 \
		-s PROD_AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID} \
		-s PROD_AWS_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY}

pretty:
	npm run pretty

dev-logs:
	sam logs --stack-name $(DEV_STACK_NAME) --tail

prod-logs:
	sam logs --stack-name $(PROD_STACK_NAME) --tail


insert-user:
	node src/local/insert-user.js
