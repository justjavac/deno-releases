import { Octokit } from "https://esm.sh/@octokit/rest@20.0.2";

const octokit = new Octokit();

async function handler(_req: Request): Promise<Response> {
  const cli = await cliVersions();
  const std = await stdVersions();

  const body = {
    cli,
    std,
  };

  return new Response(JSON.stringify(body, null, 2));
}

async function cliVersions() {
  const owner = "denoland";
  const repo = "deno";

  const { data } = await octokit.rest.repos.listReleases({
    owner,
    repo,
    per_page: 100,
  });

  return data.map((release) => release.name);
}

async function stdVersions() {
  const owner = "denoland";
  const repo = "deno_std";

  const { data } = await octokit.rest.repos.listReleases({
    owner,
    repo,
    per_page: 100,
  });

  return data.map((release) => release.name);
}

Deno.serve(handler);
