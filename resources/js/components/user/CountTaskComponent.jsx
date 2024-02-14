import React, { useEffect, useState } from "react";

const CountTaskComponent = ({ checklistGroups, checklist }) => {
    const [sumUserTaskCount, setSumUserTaskCount] = useState(0);
    const [sumTaskCount, setSumTaskCount] = useState(0);

    useEffect(() => {
        if (!checklistGroups) return;

        setSumTaskCount(0);
        setSumUserTaskCount(0);

        Object.entries(checklistGroups[checklist.checklistGroupId].checklists).map(([key, checklistItem]) => {
            setSumTaskCount((prevSumTaskCount) => {
                return prevSumTaskCount + checklistItem.count_tasks;
            });

            setSumUserTaskCount((prevSumUserTaskCount) => {
                return (
                    prevSumUserTaskCount + checklistItem.count_user_completed_tasks
                );
            });
        });
    }, [checklistGroups]);

    return (
        <div className="card m-3">
            <div className="card-header">Store Review</div>

            <div className="card-body">
                <div className="row text-center">
                    {checklistGroups &&
                        Object.entries(checklistGroups[checklist.checklistGroupId].checklists).map(([key, checklistItem]) => {
                            return (
                                <div
                                    className="col mb-sm-2 mb-0"
                                    key={checklistItem.id}
                                >
                                    <div className="text-medium-emphasis">
                                        {checklistItem.name}
                                    </div>
                                    <div className="fw-semibold">
                                        {checklistItem.count_user_completed_tasks} /{" "}
                                        {checklistItem.count_tasks}
                                    </div>
                                    <div className="progress progress-thin mt-2">
                                        <div
                                            className="progress-bar bg-success"
                                            role="progressbar"
                                            style={{
                                                width: `${(checklistItem.count_user_completed_tasks /
                                                    checklistItem.count_tasks) *
                                                    100
                                                    }%`,
                                            }}
                                            aria-valuemin="0"
                                            aria-valuemax="100"
                                        ></div>
                                    </div>
                                </div>
                            )
                        })
                    }

                    <div className="col mb-sm-2 mb-0">
                        <div
                            className="fw-semibold"
                            style={{ fontSize: "31px" }}
                        >
                            {sumUserTaskCount} / {sumTaskCount}
                        </div>
                        <div className="progress progress-thin mt-2">
                            <div
                                className="progress-bar bg-success"
                                role="progressbar"
                                style={{
                                    width: `${(sumUserTaskCount / sumTaskCount) * 100
                                        }%`,
                                }}
                                aria-valuemin="0"
                                aria-valuemax="100"
                            ></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CountTaskComponent;
