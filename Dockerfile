FROM node:22-alpine
ARG HUGEICONS_NPM_TOKEN
ENV HUGEICONS_NPM_TOKEN=$HUGEICONS_NPM_TOKEN
RUN corepack enable && corepack prepare pnpm@10.33.2 --activate
WORKDIR /repo
COPY --from=hogoshi_ui packages /repo/ui/packages
COPY --from=hogoshi_ui package.json /repo/ui/package.json
COPY --from=hogoshi_ui pnpm-workspace.yaml /repo/ui/pnpm-workspace.yaml
COPY --from=hogoshi_ui pnpm-lock.yaml /repo/ui/pnpm-lock.yaml
COPY . /repo/app
WORKDIR /repo/app
RUN node --input-type=module -e "import fs from 'node:fs'; const p=JSON.parse(fs.readFileSync('package.json','utf8')); p.dependencies['@hogoshi/ui']='file:../ui/packages/ui'; p.dependencies['@hogoshi/tokens']='file:../ui/packages/tokens'; fs.writeFileSync('package.json', JSON.stringify(p,null,2)+'\n');"
RUN pnpm install && pnpm build
EXPOSE 3000
ENV HOSTNAME=0.0.0.0
CMD ["pnpm", "start"]
