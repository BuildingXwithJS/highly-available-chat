# Basic horizontally scalable chat app build with Node.js, Redis and Docker Swarm

A simple chat app that demonstrates horizontal scaling.

## Setup

1. Build docker image using `docker build -t ha-chat .`
2. Deploy the stack to docker swarm using `docker stack deploy -c docker-compose.yml chat`
3. Scale chat instances using `docker service scale chat_chat=X` (where X is number of instances)
