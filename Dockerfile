FROM node:22-alpine
ARG HUGEICONS_NPM_TOKEN
ARG HOGOSHI_NPM_TOKEN
ENV HUGEICONS_NPM_TOKEN=$HUGEICONS_NPM_TOKEN
ENV HOGOSHI_NPM_TOKEN=$HOGOSHI_NPM_TOKEN
RUN corepack enable && corepack prepare pnpm@10.33.2 --activate
WORKDIR /app
COPY . .
RUN pnpm install && pnpm build && pnpm exec obfuscate-hogoshi .next
EXPOSE 3000
ENV HOSTNAME=0.0.0.0
CMD ["pnpm", "start"]
