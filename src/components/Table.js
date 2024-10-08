import React, { useState, useCallback, useEffect } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { RiDeleteBin6Line } from "react-icons/ri";
import { BsGrid3X3GapFill } from "react-icons/bs";
import DraggableRow from "./DraggableRow";
import GalleryPopup from "./GalleryPopup";

const Table = () => {
  const [tabledata, setTableData] = useState([]);
  const [variantsCount, setVariantsCount] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCell, setSelectedCell] = useState(null);
  const [images, setImages] = useState([]);

  useEffect(() => {
    fetch("/data.json")
      .then((response) => response.json())
      .then((jsonData) => {
        setTableData(jsonData.data);
        setVariantsCount(jsonData.variantscount);
      })
      .catch((error) => {
        console.error("Error fetching JSON data:", error);
      });
  }, []);

  const moveRow = useCallback((dragIndex, hoverIndex) => {
    setTableData((prevData) => {
      const updatedData = [...prevData];
      const [movedRow] = updatedData.splice(dragIndex, 1);
      updatedData.splice(hoverIndex, 0, movedRow);
      return updatedData;
    });
  }, []);

  const doAddVariant = () => {
    let [tableDataFirstItemCopy] = tabledata;
    var newObject = JSON.parse(JSON.stringify(tableDataFirstItemCopy));
    let newVariant = {
      id: newObject.variants.pop().id + 1,
      image_name: "",
      src: "",
    };
    setTableData((prevState) =>
      prevState.map((val) => ({
        ...val,
        variants: [...val.variants, newVariant],
      }))
    );
    setVariantsCount((prevState) => prevState + 1);
  };

  const doDeleteItem = (rowId) => {
    setTableData((prevData) => prevData.filter((data) => data.id !== rowId));
  };

  const doAddRow = () => {
    const newId =
      tabledata.length > 0 ? tabledata[tabledata.length - 1].id + 1 : 1;
    const newVariants = Array.from({ length: variantsCount }, (_, i) => ({
      id: i + 1,
      image_name: "",
      src: "",
    }));
    const newRow = {
      id: newId,
      product_filter: [],
      variants: newVariants,
    };

    setTableData((prevState) => [...prevState, newRow]);
  };

  const doDeleteVariant = (variantIndex) => {
    const updatedData = tabledata.map((item) => ({
      ...item,
      variants: item.variants.filter(
        (variant, index) => index !== variantIndex
      ),
    }));
    setTableData(updatedData);
    setVariantsCount((prevState) => prevState - 1);
  };

  const handleOpenModal = (rowIndex, variantIndex) => {
    setSelectedCell({ rowIndex, variantIndex });
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedCell(null);
  };

  const handleSelectImage = (image) => {
    console.log(selectedCell);
    if (selectedCell) {
      const { rowIndex, variantIndex } = selectedCell;
      const updatedData = [...tabledata];
      updatedData[rowIndex].variants = updatedData[rowIndex].variants.map(
        (variant, index) =>
          index === variantIndex
            ? { ...variant, src: image.src, image_name: image.name }
            : variant
      );

      setTableData(updatedData);
      handleCloseModal();
    }
  };

  const doAddDesign = (index, varIndex) => {
    console.log(index, varIndex);
    handleOpenModal(index, varIndex);
    const importAllImages = () => {
      const images = Array.from(
        { length: 10 },
        (_, i) => `/mens_photos/men image ${i + 1}.jpg`
      );
      setImages(images);
    };

    importAllImages();
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="Table-Container">
        <div className="table-wrapper">
          <table id="products">
            <thead>
              <tr>
                <th className="sticky-col"></th>
                <th className="sticky-col">Product Filter</th>
                {Array.from({ length: variantsCount }, (_, i) =>
                  i === 0 ? (
                    <th key={i}>Primary Variant</th>
                  ) : (
                    <th key={i}>
                      Variant {i + 1}
                      <RiDeleteBin6Line
                        className="delete-button"
                        style={{
                          color: "red",
                          cursor: "pointer",
                          marginLeft: "10px",
                        }}
                        size={18}
                        onClick={() => doDeleteVariant(i)}
                      />
                    </th>
                  )
                )}
                <th></th>
              </tr>
            </thead>
            <tbody>
              {tabledata?.map((val, index) => (
                <DraggableRow
                  key={val.id}
                  id={val.id}
                  index={index}
                  moveRow={moveRow}>
                  <td
                    className="sticky-col"
                    style={{
                      minWidth: "100px",
                      fontSize: "xxx-large",
                    }}>
                    <div>
                      <RiDeleteBin6Line
                        className="delete-button"
                        style={{ color: "red", cursor: "pointer" }}
                        size={35}
                        onClick={() => doDeleteItem(val.id)}
                      />
                      <div style={{ cursor: "move" }}>
                        <span>{index + 1}</span>
                        <BsGrid3X3GapFill size={30} />
                      </div>
                    </div>
                  </td>
                  <td
                    className="sticky-col"
                    style={{
                      minWidth: "500px",
                      backgroundColor: "white",
                      textAlign: "center",
                    }}>
                    {val.product_filter.length === 0 ? (
                      <div>
                        <button>Add Product Filter</button>
                      </div>
                    ) : (
                      val.product_filter.map((filter, filterIndex) => (
                        <span
                          key={filterIndex}
                          style={{
                            boxShadow: "0 6px 8px rgba(0, 0, 0, 0.1)",
                            margin: "5px",
                            padding: "5px",
                            textWrap: "wrap",
                            borderRadius: "4px",
                          }}>
                          {filter}
                        </span>
                      ))
                    )}
                  </td>
                  {Array.isArray(val.variants) &&
                    val.variants.map((variant, varIndex) => (
                      <td
                        key={varIndex}
                        style={{ minWidth: "200px", textAlign: "center" }}>
                        {variant?.src === "" ? (
                          <div>
                            <button
                              onClick={() => doAddDesign(index, varIndex)}>
                              Add Design
                            </button>
                          </div>
                        ) : (
                          <div>
                            <img
                              src={variant.src}
                              alt={`Image ${varIndex + 1}`}
                              style={{
                                width: "100px",
                                height: "150px",
                                objectFit: "fit",
                              }}
                            />
                            <div>{variant.image_name}</div>
                          </div>
                        )}
                      </td>
                    ))}
                  <td>
                    <button onClick={doAddVariant}>+</button>
                  </td>
                </DraggableRow>
              ))}
              <tr>
                <td className="sticky-col" style={{ textAlign: "left" }}>
                  <button onClick={doAddRow}>+</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      {modalOpen && (
        <GalleryPopup
          modalOpen={modalOpen}
          handleCloseModal={handleCloseModal}
          handleSelectImage={handleSelectImage}
          images={images}
        />
      )}
    </DndProvider>
  );
};

export default Table;
