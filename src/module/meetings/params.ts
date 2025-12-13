import { createLoader, parseAsInteger, parseAsString, parseAsStringEnum } from "nuqs/server";
import { MeetingStatus } from "./types";
import { AGENT_PAGE } from "@/constants";

export const filterSearchParams = {
        search: parseAsString.withDefault("").withOptions({ clearOnDefault: true }),
        page: parseAsInteger.withDefault(AGENT_PAGE).withOptions({ clearOnDefault: true }),
        status: parseAsStringEnum(Object.values(MeetingStatus)),
        agentId: parseAsString.withDefault("").withOptions({clearOnDefault: true}),
}

export const loadSearchParams = createLoader(filterSearchParams); 