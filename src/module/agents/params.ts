import { createLoader, parseAsInteger, parseAsString } from "nuqs/server";

import { AGENT_PAGE } from "@/constants";

export const filterSearchParams = {
        search: parseAsString.withDefault("").withOptions({ clearOnDefault: true }),
        page: parseAsInteger.withDefault(AGENT_PAGE).withOptions({ clearOnDefault: true }),
}

export const loadSearchParams = createLoader(filterSearchParams); 