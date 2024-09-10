import React, { ChangeEvent, useState } from "react";

interface dataType {
  Id: number;
  Name: string;
  Link: string;
  MaxInTake: string;
  ShouldCook: string;
  Description: string;
  Nutrition: readonly string[];
}

const data: dataType = {
  Id: 1,
  Name: "",
  Description: "",
  Link: "",
  ShouldCook: "",
  MaxInTake: "",
  Nutrition: [],
};

const NutritionData: readonly string[] = [
  "Vitamin A",
  "Vitamin B",
  "Vitamin C",
  "Vitamin D",
  "Vitamin E",
];

function FormAndTable() {
  const [inputData, setinputData] = useState<dataType[]>([]);
  const [formData, setFormData] = useState<dataType>(data);
  const [isNutritionOpen, setisNutritionOpen] = useState<boolean>(false);
  const [clickedNutritions, setclickedNutritions] = useState<readonly string[]>([]);
  const [isOpenDetails, setIsOpenDetails] = useState<boolean>(false);
  const [checkedIndices, setCheckedIndices] = useState<number[]>([]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleCheckboxChange = (index: number) => {
    setCheckedIndices((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const handleDelete = (id: dataType): void => {
    setinputData(inputData.filter((item: dataType) => item !== id));
  };

  const handleSubmit = (): void => {
    setinputData([...inputData, { ...formData, Nutrition: clickedNutritions }]);
    setFormData({...data,Id: formData.Id+1} );
    setclickedNutritions([]);
    setisNutritionOpen(false);
  };

  const handleView = (): void => {
    setIsOpenDetails(!isOpenDetails);
  };

  const handleShowNutritionName = () => {
    setisNutritionOpen(!isNutritionOpen);
  };

  const handleCheckbox = (name: string): void => {
    setclickedNutritions((prevChecked) =>
      prevChecked.includes(name)
        ? prevChecked.filter((itemName) => itemName !== name)
        : [...prevChecked, name]
    );
  };
  const handleLog = () => {
    console.log(inputData);
  };
  const handleDeleteAll = () => {
    setinputData(
      inputData.filter((item, index) => !checkedIndices.includes(index))
    );
    setCheckedIndices([]);
  };

  return (
    <div>
      <table > 
        <thead className="head">
          <tr>
            <th></th>
            {Object.keys(formData).map((key) => (
              <th key={key}>{key.toUpperCase()}</th>
            ))}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {inputData.map((item, i) => (
            <tr key={item.MaxInTake}>
              <td>
                <input
                  type="checkbox"
                  checked={checkedIndices.includes(i)}
                  onChange={() => handleCheckboxChange(i)}
                />
              </td>
              <td>{item.Id}</td>
              <td>{item.Name}</td>
              <td>{item.Description}</td>
              <td>
                <a href={item.Link} target="_blank" rel="noreferrer">
                  {item.Link}
                </a>
              </td>
              <td>{item.ShouldCook}</td>
              <td>{item.MaxInTake}</td>
              <td>{item.Nutrition.join(", ")}</td>
              <td>
                <button onClick={() => handleDelete(item)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
        <tbody>
          <tr>
            <td></td>
            <td>{formData.Id}</td>
            <td>
              <input
                type="text"
                name="Name"
                value={formData.Name}
                onChange={handleInputChange}
                placeholder="Enter the Name"
              />
            </td>
            <td>
              <input
                type="text"
                name="Description"
                value={formData.Description}
                onChange={handleInputChange}
                placeholder="Enter Your Description"
              />
            </td>
            <td>
              <input
                type="link"
                name="Link"
                value={formData.Link}
                onChange={handleInputChange}
                placeholder="Enter the Link"
              />
            </td>

            <td>
              <label>
                <input
                  type="radio"
                  name="ShouldCook"
                  value="Yes"
                  checked={formData.ShouldCook === "Yes"}
                  onChange={handleInputChange}
                />
                Yes
              </label>
              <label>
                <input
                  type="radio"
                  name="ShouldCook"
                  value="No"
                  checked={formData.ShouldCook === "No"}
                  onChange={handleInputChange}
                />
                No
              </label>
            </td>
            <td>
              <input
                name="MaxInTake"
                value={formData.MaxInTake}
                onChange={handleInputChange}
                placeholder="Enter the Max.Intake Per Day"
              />
            </td>
            <td>
              <input
                type="text"
                name="Nutrition"
                value={clickedNutritions}
                onChange={handleInputChange}
                onClick={handleShowNutritionName}
                placeholder="Select Your Nutritions"
              />
              {isNutritionOpen && (
                <td>
                  {NutritionData.map((option, i) => (
                    <div key={i}>
                      <input
                        type="checkbox"
                        checked={clickedNutritions.includes(option)}
                        onChange={() => handleCheckbox(option)}
                      />
                      {option}
                    </div>
                  ))}
                </td>
              )}
            </td>

            <td>
              <button onClick={handleSubmit}>Add</button>
            </td>
          </tr>
        </tbody>
      </table>
      <div className="footter">
        <button onClick={handleView}>Details</button>
        <button onClick={handleLog}>Log</button>
        <button onClick={handleDeleteAll}>Delete</button>
      </div>
      {isOpenDetails &&
        inputData
          .filter((item, index) => checkedIndices.includes(index))
          .map((item, i) => (
            <table key={i}>
              <tr>Details </tr>
              <tr>
                <td>
                  <strong>Name:</strong>
                </td>
                <td>{item.Name}</td>
              </tr>
              <tr>
                <td>
                  <strong>Description:</strong>
                </td>
                <td className="text">{item.Description}</td>
              </tr>
              <tr>
                <td>
                  <strong>Link:</strong>
                </td>
                <td className="text">{item.Link}</td>
              </tr>
              <tr>
                <td>
                  <strong>MaxInTake:</strong>
                </td>
                <td className="text">{item.MaxInTake}</td>
              </tr>
              <tr>
                <td>
                  <strong>ShouldCook:</strong>
                </td>
                <td className="text">{item.ShouldCook}</td>
              </tr>
              <tr>
                <td>
                  <strong>Nutrition:</strong>
                </td>
                <td className="text">{item.Nutrition.join(", ")}</td>
                <td><a href={item.Link} target="_blank" rel="noreferrer"><button>Learn More</button></a></td>
                <hr />
              </tr>
            </table>
          ))}
    </div>
  );
}

export default FormAndTable;
