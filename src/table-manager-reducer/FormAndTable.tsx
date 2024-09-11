import React, { ChangeEvent, useReducer } from "react";
import produce from 'immer';
import _ from 'lodash';

interface DataType {
  id: number;
  name: string;
  link: string;
  maxInTake: string;
  shouldCook: string;
  description: string;
  nutrition: readonly string[];
}

const initialData: DataType = {
  id: 1,
  name: "",
  description: "",
  link: "",
  shouldCook: "",
  maxInTake: "",
  nutrition: [],
};

const NutritionData: readonly { label: string; children: string }[] = [
  { label: "Vitamin A", children: "vitamin-a" },
  { label: "Vitamin B", children: "vitamin-b" },
  { label: "Vitamin C", children: "vitamin-c" },
  { label: "Vitamin D", children: "vitamin-d" },
  { label: "Vitamin E", children: "vitamin-e" },
];

type Action =
  | { type: "setFormData"; payload: DataType }
  | { type: "setInputData"; payload: DataType[] }
  | { type: "setIsOpenNutrition"; payload: string }
  | { type: "setIsOpenDetails" }
  | { type: "setIsOpenLog" }
  | { type: "setIsOpenDelete" }
  | { type: "setCheckedItems"; payload: number }
  | { type: "deleteItem"; payload: DataType }
  | { type: "setCheckNutrition"; payload: string }
  | { type: 'SET_ACTIVE_SECTION'; payload: 'details' | 'log' | 'delete' | 'none' }
  | { type: "deleteAllItems" };

interface State {
  inputData: DataType[];
  formData: DataType;
  isNutritionOpen: boolean;
  checkedIndexNumber: number[];
  activeSection: 'details' | 'log' | 'delete' | 'none';
}

const initialState: State = {
  inputData: [],
  formData: initialData,
  isNutritionOpen: false,
  checkedIndexNumber: [],
  activeSection: 'none',
};

const reducer = produce((state: State, action: Action) => {
  switch (action.type) {
    case "setFormData":
      state.formData = action.payload;
      break;
    case "setInputData":
      state.inputData = action.payload;
      state.isNutritionOpen = !state.isNutritionOpen;
      state.formData  = {...initialData ,nutrition: [] , id: state.formData.id +1  }
      break;
    case "setIsOpenNutrition":
      state.isNutritionOpen =!state.isNutritionOpen;
      break;    
    case "setCheckedItems":
      state.checkedIndexNumber  = _.includes(state.checkedIndexNumber,action.payload)
      ? _.filter(state.checkedIndexNumber,i => i !== action.payload)
      : [...state.checkedIndexNumber, action.payload];
      break;
    case "deleteItem":
      state.inputData = _.filter(state.inputData,item => item !== action.payload);
      break;
    case "deleteAllItems":
      state.inputData  = _.filter(state.inputData,(item, index) => !(_.includes(state.checkedIndexNumber,index)));
      state.checkedIndexNumber = [];
      break;
    case "setCheckNutrition":
      state.formData.nutrition = _.includes(state.formData.nutrition,action.payload)
        ? _.filter(state.formData.nutrition,nutrition => nutrition !== action.payload)
        : [...state.formData.nutrition, action.payload];
      break;
      case 'SET_ACTIVE_SECTION':
        return {
          ...state,
          activeSection: state.activeSection === action.payload ? 'none' : action.payload
        };

    default:
      return state;
  }
});
function FormAndTable() {
    const [state, dispatch] = useReducer(reducer, initialState);
  
    const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
      const { name, value } = e.target;
      dispatch({
        type: "setFormData",
        payload: { ...state.formData, [name]: value },
      });
    };

    const handleSectionChange = (section: 'details' | 'log' | 'delete' | 'none') => {
      dispatch({ type: 'SET_ACTIVE_SECTION', payload: section });
    };
  
    const handleCheckboxChange = (index: number) => {
      dispatch({ type: "setCheckedItems", payload: index });
    };

    const handleDelete = (id: DataType): void => {
      dispatch({ type: "deleteItem", payload: id });
    };
  
    const handleSubmit = (): void => {
      dispatch({ type: "setInputData", payload: [...state.inputData,state.formData ],});
      dispatch({ type: "setFormData", payload: { ...initialData, id: state.formData.id + 1 } });
    };

    const handleShowNutritionname = () => {
      dispatch({ type: "setIsOpenNutrition", payload: "" });
    };

    const handleCheckbox = (name: string): void => {
      dispatch({ type: "setCheckNutrition", payload: name });
    };
  
    const handleLog = () => {
      dispatch({ type: "setIsOpenLog" });
      console.log(state.inputData);
    };
  
    const handleDeleteAll = () => {
      dispatch({ type: "deleteAllItems" });
      dispatch({ type: "setIsOpenDelete" });
    };
  
    const handleDeleteView = () => {
      dispatch({ type: "setIsOpenDelete" });
    };
  
    const selectedItems =_.filter(state.inputData,(item, index) => _.includes(state.checkedIndexNumber,index));
  
    return (
      <div>
        <table>
          <thead className="head">
            <tr>
              <th></th>
              {_.map(Object.keys(state.formData),(key) => (
                <th key={key}>{key.toUpperCase()}</th>
              ))}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {_.map(state.inputData,(item, i) => (
              <tr key={item.maxInTake}>
                <td>
                  <input
                    type="checkbox"
                    checked={state.checkedIndexNumber.includes(i)}
                    onChange={() => handleCheckboxChange(i)}
                  />
                </td>
                <td>{item.id}</td>
                <td>{item.name}</td>
                <td>{item.description}</td>
                <td>
                    {item.link}
                </td>
                <td>{item.shouldCook}</td>
                <td>{item.maxInTake}</td>
                <td>{_.join(item.nutrition,", ")}</td>
                <td>
                  <button onClick={() => handleDelete(item)}>Delete</button>
                </td>
              </tr>
            ))}
  
            <tr>
              <td></td>
              <td>{state.formData.id}</td>
              <td>
                <input
                  type="text"
                  name="name"
                  value={state.formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter the name"
                />
              </td>
              <td>
                <input
                  type="text"
                  name="description"
                  value={state.formData.description}
                  onChange={handleInputChange}
                  placeholder="Enter Your description"
                />
              </td>
              <td>
                <input
                  type="link"
                  name="link"
                  value={state.formData.link}
                  onChange={handleInputChange}
                  placeholder="Enter the link"
                />
              </td>
  
              <td>
                <label>
                  <input
                    type="radio"
                    name="shouldCook"
                    value="Yes"
                    checked={state.formData.shouldCook === "Yes"}
                    onChange={handleInputChange}
                  />
                  Yes
                </label>
                <label>
                  <input
                    type="radio"
                    name="shouldCook"
                    value="No"
                    checked={state.formData.shouldCook === "No"}
                    onChange={handleInputChange}
                  />
                  No
                </label>
              </td>
              <td>
                <input
                  name="maxInTake"
                  value={state.formData.maxInTake}
                  onChange={handleInputChange}
                  placeholder="Enter the Max.Intake Per Day"
                />
              </td>
              <td>
                <input
                  type="text"
                  name="nutrition"
                  value={_.join(state.formData.nutrition,", ")}
                  onClick={handleShowNutritionname}
                  placeholder="Select Your Nutritions"
                />
                {state.isNutritionOpen && (
                  <div>
                    {_.map(NutritionData,(option, i) => (
                      <div key={i}>
                        <input
                          type="checkbox"
                          checked={_.includes(state.formData.nutrition,option.children)}
                          onChange={() => handleCheckbox(option.children)}
                        />
                        {option.label}
                      </div>
                    ))}
                  </div>
                )}
              </td>
  
              <td>
                <button onClick={handleSubmit}>Add</button>
              </td>
            </tr>
          </tbody>
        </table>
        <div className="footter">
          <button onClick={() => handleSectionChange('details')}>Details</button>
          <button onClick={() => handleSectionChange('log')} onClickCapture={handleLog}>Log</button>
          <button onClick={() => handleSectionChange('delete')}>Delete</button>
        </div>
        <div>{state.activeSection === 'log'  && <span>See Console</span>} </div>
        <div>
          {state.activeSection === 'delete'  && (selectedItems.length >0) && (
            <div className="div-alert">
              <p> Do You want to delete ?</p>
              <div>
                <button onClick={handleDeleteView}>No</button>
                <button onClick={handleDeleteAll}>Yes</button>
              </div>
            </div>
          )}
        </div>
        <div>
          {(selectedItems.length === 1) && state.activeSection === 'details' && (
            <table>
              <tbody>
                {_.map(selectedItems,(item, i) => (
                  <div key={i}>
                    <tr className="detail">
                      <td>Name:</td>
                      <td>{item.name}</td>
                    </tr>
                    <tr className="detail">
                      <td>Description:</td>
                      <td>{item.description}</td>
                    </tr>
                    <tr className="detail">
                      <td>Link:</td>
                      <td>{item.link}</td>
                    </tr>
                    <tr className="detail">
                      <td>Max Intake:</td>
                      <td>{item.maxInTake}</td>
                    </tr>
                    <tr className="detail">
                      <td>Should Cook:</td>
                      <td>{item.shouldCook}</td>
                    </tr>
                    <tr className="detail">
                      <td>Nutrition:</td>
                      <td>{_.join(item.nutrition,", ")}</td>
                    </tr>
                  </div>
                ))}
              </tbody>
              <a href={selectedItems[0].link} target="_blank" rel="noreferrer">
                <button>Learn More</button>
              </a>
            </table>
          )}
        </div>
      </div>
    );
  }
  
  export default FormAndTable;
  