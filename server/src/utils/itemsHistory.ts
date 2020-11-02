import { IWfStat } from "@/interfaces/response.interface";

export type ItemsHistory = {
    [key in PropertyKey]: {
        history: IWfStat[];
    };
};

export const parseItemsHistory: (data: IWfStat[]) => ItemsHistory = (
    data
) =>
    Object.fromEntries(
        Object.entries(
            data
                .filter((item) => +item.type === 1)
                .reduce(
                    (
                        itemsHistory: { [key in PropertyKey]: IWfStat[] },
                        item
                    ) => {
                        let history = itemsHistory[item.envelope_id] || [];
                        itemsHistory[item.envelope_id] = [...history, item];
                        return itemsHistory;
                    },
                    Object.create(null)
                )
        ).map(([id, item]) => [
            id,
            {
                history: [...item].sort(
                    (a, b) =>
                        new Date(a.start_datetime).getTime() -
                        new Date(b.start_datetime).getTime()
                ).filter((item, i, arr) => i == 0 || item.to_status_id !== arr[i - 1].to_status_id),
            },
        ])
    );
