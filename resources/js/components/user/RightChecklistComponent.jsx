import React from 'react';
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

const RightChecklistComponent = ({ expandedTask, onFavoritedTask }) => {
    return expandedTask.status && (
        console.log(expandedTask, 'expandedTask'),
        <div className='col-4'>
            <div className="card m-3">
                <div className="card-body">
                    <div className="text-medium-emphasis">
                        {expandedTask.task.name}

                        <a className='float-end info-color' onClick={(e) => onFavoritedTask(e, expandedTask.task, expandedTask.index)}>
                            {expandedTask.task.is_favorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                        </a>
                    </div>
                </div>
            </div>

            <div className="card m-3">
                <div className="card-body">
                    <div className="row text-center">
                        Add to My Day
                    </div>
                </div>
            </div>

            <div className="card m-3">
                <div className="card-body">
                    <div className="row text-center">
                        Remain me
                    </div>
                    <br />
                    <div className="row text-center">
                        <div className="col">
                            <button className="btn btn-primary">Today</button>
                        </div>
                        <div className="col">
                            <button className="btn btn-primary">Tomorrow</button>
                        </div>
                        <div className="col">
                            <button className="btn btn-primary">Next Week</button>
                        </div>
                    </div>
                </div>
            </div>

            <div className='card m-3'>
                <div className="card-body">
                    Note
                </div>
            </div>
        </div>
    );
};

export default RightChecklistComponent;
