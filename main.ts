import { Octokit } from "https://esm.sh/@octokit/rest@21.0.1";

const octokit = new Octokit();
const kv = await Deno.openKv();

async function handler(_req: Request): Promise<Response> {
  const expireIn: number = 1000 * 60 * 60 * 24;

  let cli = (await kv.get<string[]>(["version", "cli"])).value;
  let std = (await kv.get<string[]>(["version", "std"])).value;

  if (cli == null) {
    cli = await cliVersions();
    await kv.set(["version", "cli"], cli, { expireIn });
  }

  if (std == null) {
    std = await stdVersions();
    await kv.set(["version", "std"], std, { expireIn });
  }

  const body = {
    cli,
    std,
  };

  return new Response(JSON.stringify(body, null, 2));
}

async function cliVersions(): Promise<string[]> {
  const owner = "denoland";
  const repo = "deno";

  const { data } = await octokit.rest.repos.listReleases({
    owner,
    repo,
    per_page: 100,
  });

  return data.map((release) => release.name).filter(Boolean) as string[];
}

async function stdVersions(): Promise<string[]> {
  const owner = "denoland";
  const repo = "deno_std";

  const { data } = await octokit.rest.repos.listReleases({
    owner,
    repo,
    per_page: 100,
  });

  return data.map((release) => release.name).filter(Boolean) as string[];
}

Deno.serve(handler);
