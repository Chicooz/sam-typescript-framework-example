DEV_STACK_NAME = etcauthapp-dev
PROD_STACK_NAME = etcauthapp-prod
DEV_S3_BUCKET_NAME = etcauthapp-user-avatars-dev
PROD_S3_BUCKET_NAME = etcauthapp-user-avatars-prod
DEV_ISSUER_URL = https://dev-bt.uk.auth0.com/
DEV_AUDIENCE_URL= http://127.0.0.1/
validate:
	sam validate && swagger-cli validate swagger/etcauthapp-api-docs.yaml

build:
	sam build --cached --parallel --beta-features

test: clean
	npm run test

start-local-dev: build
	sam local start-api \
		--parameter-overrides \
			EnvironmentType=Dev \
			ParameterPrefix=etcauthapp \
			IssuerUrl=${DEV_ISSUER_URL}\
			APIAudience=${DEV_AUDIENCE_URL}\

start-local-prod: build
	sam local start-api \
		--parameter-overrides \
			EnvironmentType=Prod \
			ParameterPrefix=etcauthapp

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
			IssuerUrl=${DEV_ISSUER_URL}\
			APIAudience=${DEV_AUDIENCE_URL}\
			S3BucketName=$(DEV_S3_BUCKET_NAME) \
			ParameterPrefix=etcauthapp

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
				ParameterPrefix=etcauthapp

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

get-users-dev:
	src/local/table-scripts/get-all-users.sh Dev

get-users-prod:
	src/local/table-scripts/get-all-users.sh Prod

insert-user:
	node src/local/table-scripts/insert-user.js

delete-user:
	node src/local/table-scripts/delete-user.js

reset-password:
	node src/local/table-scripts/reset-password.js

revoke-token:
	node src/local/table-scripts/revoke-token.js

reset-user:
	node src/local/table-scripts/reset-user.js
