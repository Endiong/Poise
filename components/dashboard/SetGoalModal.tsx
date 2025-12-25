
import React, { useState } from 'react';
import { CloseIcon } from '../icons/Icons';

interface SetGoalModalProps {
  currentGoal: number;
  onClose: () => void;
  onSave: (newGoal: number) => void;
}

const SetGoalModal: React.FC<SetGoalModalProps> = ({ currentGoal, onClose, onSave }) => {
    const [goal, setGoal] = useState(currentGoal);

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center" onClick={onClose}>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-8 w-full max-w-md m-4 text-gray-900 dark:text-gray-200" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold">Set Daily Goal</h2>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                        <CloseIcon />
                    </button>
                </div>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Set the percentage of your active session you aim to maintain good posture.
                </p>
                <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                        <label htmlFor="goal-slider" className="font-medium">Goal</label>
                        <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">{goal}%</span>
                    </div>
                    <input 
                        id="goal-slider"
                        type="range"
                        min="10"
                        max="100"
                        step="5"
                        value={goal}
                        onChange={(e) => setGoal(parseInt(e.target.value, 10))}
                        className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-600 dark:accent-blue-500"
                    />
                     <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                        <span>10%</span>
                        <span>100%</span>
                    </div>
                </div>

                <div className="flex justify-end gap-4">
                    <button 
                        onClick={onClose}
                        className="px-6 py-2 rounded-full font-semibold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => onSave(goal)}
                        className="px-6 py-2 rounded-full font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                    >
                        Save Goal
                    </button>
                </div>
            </div>
        </div>
    )
}

export default SetGoalModal;