import { Command } from "@command/Command";
import CommandExecutor from "@command/CommandExecutor";
import clientModule from "@/index";
import { Status } from "@/types";
import { getLawsByStatus, lawsByStatus } from "@service/lawService";
import { format } from "@/generator";
import { lawToTextSimple } from "@/generator/law";
import { isNaN } from "lodash";

const config: Record<string, string> = require("../../../config.json");

export default class LawListExecutor extends CommandExecutor {
    async execute(command: Command) {
        let limit: number = +command.props["limit"];
        let page: number = +command.props["page"];

        if (isNaN(limit)) limit = 50;
        if (isNaN(page)) page = 1;

        if (
            !["PASSED", "VETOED", "CANCELED", "FAILED", "UNDER_VOTE"].includes(
                command.props["status"].toUpperCase()
            )
        ) {
            clientModule.client!.sendText(
                command.group,
                "That's not a valid argument."
            );
            return;
        }
        let status = command.props["status"].toUpperCase() as Status;

        let laws = await lawsByStatus(status, page, limit);

        if (!laws) return;

        let text = `${format(status)} laws`;

        laws.forEach((law) => {
            text += lawToTextSimple(law) + "\n\n";
        });

        text += `- Page 1 - Displaying ${laws.length} law${
            laws.length > 1 ? "s" : ""
        }
for the next page, use the same command with prop #page 2`;

        clientModule.client?.sendText(command.group, "");
    }
    constructor() {
        super([], { status: "passed", page: "1", limit: "50" }, []);
    }
}
