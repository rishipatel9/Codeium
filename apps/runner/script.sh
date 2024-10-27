docker rmi runner --force
docker build -t runner .
docker tag runner rishi91/runner:latest
docker push rishi91/runner:latest
