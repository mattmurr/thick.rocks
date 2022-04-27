import { Construct } from "constructs";
import {
  CodePipeline,
  CodePipelineSource,
  CodeBuildStep,
} from "aws-cdk-lib/pipelines";
import { SiteStage } from "./site-stage";
import { Stack } from "aws-cdk-lib";
import { SiteStackProps } from "./site-stack";

export class PipelineStack extends Stack {
  constructor(scope: Construct, id: string, props: SiteStackProps) {
    super(scope, id, props);

    const pipeline = new CodePipeline(this, "Pipeline", {
      synth: new CodeBuildStep("Synth", {
        input: CodePipelineSource.connection("mattmurr/thick.rocks", "master", {
          connectionArn: `arn:aws:codestar-connections:eu-west-2:${this.account}:connection/a94c4c50-f461-4d32-bdbb-e33329b79fc3`,
        }),
        commands: ["npm ci", "npm run build", "npm run synth"],
        primaryOutputDirectory: "cdk/cdk.out",
      }),
    });

    pipeline.addStage(
      new SiteStage(this, "Stage", props)
    );
  }
}