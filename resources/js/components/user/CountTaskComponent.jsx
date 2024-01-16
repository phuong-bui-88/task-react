import ChecklistGroupService from "@services/ChecklistGroupService";
import React, { useEffect, useState } from "react";

const CountTaskComponent = ({ checklistGroups, checklist }) => {
    const [groupIndex, setGroupIndex] = useState(0);
    const [sumUserTaskCount, setSumUserTaskCount] = useState(0);
    const [sumTaskCount, setSumTaskCount] = useState(0);

    useEffect(() => {
        if (!checklistGroups) return;

        setSumTaskCount(0);
        setSumUserTaskCount(0);

        const { groupIndex, checklistIndex } =
            ChecklistGroupService.findIndexesByChecklistId(
                checklistGroups,
                checklist.id
            );

        setGroupIndex(groupIndex);

        checklistGroups[groupIndex].checklists.map((checklist, index) => {
            setSumTaskCount((prevSumTaskCount) => {
                return prevSumTaskCount + checklist.count_tasks;
            });

            setSumUserTaskCount((prevSumUserTaskCount) => {
                return (
                    prevSumUserTaskCount + checklist.count_user_completed_tasks
                );
            });
        });
    }, [checklistGroups]);

    return (
        <div className="card m-3">
            <div className="card-header">Count Task Component</div>

            <div className="card-body">
                <div className="row text-center">
                    {checklistGroups &&
                        checklistGroups[groupIndex].checklists.map(
                            (checklist, index) => (
                                <div
                                    className="col mb-sm-2 mb-0"
                                    key={checklist.id}
                                >
                                    <div className="text-medium-emphasis">
                                        {checklist.name}
                                    </div>
                                    <div className="fw-semibold">
                                        {checklist.count_user_completed_tasks} /{" "}
                                        {checklist.count_tasks}
                                    </div>
                                    <div className="progress progress-thin mt-2">
                                        <div
                                            className="progress-bar bg-success"
                                            role="progressbar"
                                            style={{
                                                width: `${(checklist.count_user_completed_tasks /
                                                        checklist.count_tasks) *
                                                    100
                                                    }%`,
                                            }}
                                            aria-valuemin="0"
                                            aria-valuemax="100"
                                        ></div>
                                    </div>
                                </div>
                            )
                        )}

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
