import { useEffect, useState } from "react";
import { TiTick } from "react-icons/ti";
import { ImCross } from "react-icons/im";

function DragAndDrop({ input, n, reset }) {
  const [result, setResult] = useState(null);
  const [isSrcDragging, setIsSrcDragging] = useState(false);
  const [isDestDragging, setIsDestDragging] = useState(false);
  const [destination, setDestination] = useState(
    new Array(n).fill({}).map((item, index) => ({
      targetId: index,
      itemId: null,
    }))
  );
  const [source, setSource] = useState(
    new Array(n).fill({}).map((item, index) => input[index].itemId)
  );
  const handleReset = () => {
    reset();
    setResult(null);
    setDestination(
      new Array(n).fill({}).map((item, index) => ({
        targetId: index,
        itemId: null,
      }))
    );
    setSource(new Array(n).fill({}).map((item, index) => input[index].itemId));
  };
  const handleDragFromDest = (e, itemId) => {
    e.dataTransfer.setData("text/plain", "des" + "-" + itemId);
    setIsDestDragging(true);
    console.log("setIsDestDragging is set true in handleDragDestination");
  };
  const handleDragFromSrc = (e, itemId) => {
    // console.log(itemId);
    e.dataTransfer.setData("text/plain", "src" + "-" + itemId);
    setIsSrcDragging(true);
    console.log("setIsSrcDragging is set true in handleDragSource");
  };
  const handleDragEnd = () => {
    setIsSrcDragging(false);
    setIsDestDragging(false);
    console.log("setDragging is set false in handleDragEnd");
    // setDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    // console.log("drag over");
  };

  const handleDropToDest = (e, targetId) => {
    e.preventDefault();
    const srcId = e.dataTransfer.getData("text/plain").split("-")[0];
    console.log(
      "\nhandleDrop =" +
        "\nisDestDragging =" +
        isDestDragging +
        "\nsrcId =" +
        srcId
    );
    if (isSrcDragging && srcId == "src") {
      console.log("from src to dest");
      const srcItemId = e.dataTransfer.getData("text/plain").split("-")[1];
      let replaceItemId = null;

      const updatedDest = destination.map((item) => {
        if (item.targetId == targetId) {
          if (item.itemId == null)
            return { ...item, itemId: Number(srcItemId) };
          else {
            replaceItemId = item.itemId;
            return { ...item, itemId: Number(srcItemId) };
          }
        } else {
          return item;
        }
      });
      console.log("updatedDest");
      console.log(updatedDest);
      setDestination(updatedDest);

      var updatedSrc;
      if (replaceItemId == null) {
        updatedSrc = source.filter((item) => item != srcItemId);
      } else {
        updatedSrc = source.map((item) =>
          item == srcItemId ? Number(replaceItemId) : item
        );
      }
      console.log("updatedSrc");
      console.log(updatedSrc);
      setSource(updatedSrc);
    } else if (isDestDragging && srcId == "des") {
      console.log("from dest to dest");
      const desItemId = e.dataTransfer.getData("text/plain").split("-")[1];
      const destDest = destination.filter(
        (dest) => dest.itemId == desItemId
      )[0];
      const destSrc = destination.filter(
        (dest) => dest.targetId == targetId
      )[0];
      const updatedDest = destination.map((dest) => {
        if (dest.targetId == destDest.targetId) {
          return {
            targetId: dest.targetId,
            itemId: destSrc.itemId,
          };
        } else if (dest.targetId == destSrc.targetId) {
          return {
            targetId: dest.targetId,
            itemId: destDest.itemId,
          };
        } else return dest;
      });
      // console.log(updatedDest);
      setDestination(updatedDest);
    }
  };
  const handleDropToSrc = (e) => {
    e.preventDefault();
    if (!isDestDragging) return;
    const srcId = e.dataTransfer.getData("text/plain").split("-")[0];
    if (srcId == "des") {
      console.log("handleDropToSrc --------------------------");
      const srcItemId = e.dataTransfer.getData("text/plain").split("-")[1];
      const updatedSrc = source.push(srcItemId);
      console.log("updatedSrc");
      console.log(updatedSrc);
      setDestination(updatedSrc);

      var updatedDest = destination.map((item) => {
        if (item.itemId == srcItemId) {
          item.itemId = null;
        }
        return item;
      });
      console.log("updatedDest");
      console.log(updatedDest);
      setDestination(updatedDest);
    }
  };
  const handleSubmit = () => {
    console.log("checking results");
    console.log(destination);
    for (let i = 1; i < destination.length; i++) {
      console.log(input[destination[i - 1].itemId]);
      if (
        input[destination[i - 1].itemId].val > input[destination[i].itemId].val
      ) {
        setResult("false");
        return;
      }
    }
    setResult("true");
    return;
  };

  return (
    <div className="h-screen flex flex-col" style={{}}>
      <header className="px-14 py-3 text-3xl font-bold">Quiz...</header>
      <div className="flex-1 flex ease-in-out transition-all select-none ">
        {result && (
          <div
            className="fixed w-full h-full flex justify-center bg-black bg-opacity-40"
            style={{ paddingTop: "20vh" }}>
            <div className="bg-white w-1/3 h-fit rounded-xl">
              <div className="pt-5 pb-10 px-10 ">
                {result === "true" ? (
                  <div className="flex flex-col justify-evenly items-center">
                    <div className="">
                      <TiTick size="50" fill="green" />
                    </div>
                    <span className="text-xl font-bold text-slate-950">
                      Congratulations you did correct!
                    </span>
                    <div className="pt-5">
                      <div
                        onClick={handleReset}
                        className="border text-lg font-medium rounded-lg text-white bg-green-700 active:bg-green-600 px-5 py-1">
                        I'll do it Again!
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col justify-evenly items-center">
                    <div className="py-3">
                      <ImCross size="40" fill="red" />
                    </div>
                    <span className="text-xl font-bold text-slate-950">
                      Sorry! It's incorrect
                    </span>
                    <div className="pt-5">
                      <div
                        onClick={handleReset}
                        className="border text-lg font-medium rounded-lg text-white bg-green-700 active:bg-green-600 px-5 py-1">
                        I'll try it Again!
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        <div
          className="h-full w-44 pt-10 flex flex-col justify- items-center bg-slate-400"
          style={{}}
          droppable="true"
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
          onDrop={(e) => handleDropToSrc(e)}>
          <div className="text-center pb-5 px-1 text-xl font-bold italic">
            <span>Number elements</span>
          </div>
          {source.map((item, index) => (
            <div key={index} className="pb-5">
              <div
                className="w-24 h-14 bg-red-600 text-white font-bold text-lg rounded-lg flex justify-center items-center hover:cursor-pointer"
                onDragStart={(e) => handleDragFromSrc(e, item)}
                onDragEnd={handleDragEnd}
                draggable="true">
                {input[item].val}
              </div>
            </div>
          ))}
        </div>
        <div
          className="flex-1 flex flex-col items-center bg-slate-300"
          style={{ paddingTop: "5%" }}>
          <div className=" bg-white rounded-xl">
            <div className="py-5 pb-8 text-center text-2xl font-bold">
              <h1 className="">Arrange the values in ascending order</h1>
            </div>
            <div
              className=" pb-10 px-5 flex justify-center items-center"
              style={{ minWidth: "600px" }}>
              {destination.map((item) => (
                <div
                  key={item.targetId}
                  className="px-1 droppable rounded-lg"
                  droppable="true"
                  onDragStart={(e) => handleDragFromDest(e, item.itemId)}
                  onDragOver={handleDragOver}
                  onDragEnd={handleDragEnd}
                  onDrop={(e) => handleDropToDest(e, item.targetId)}>
                  <div
                    className={
                      item.itemId != null
                        ? "w-24 h-14 bg-red-600 text-white font-bold text-lg rounded-lg flex justify-center items-center hover:cursor-pointer"
                        : "w-28 h-14 border border-black italic text-sm rounded-lg flex justify-center items-center hover:cursor-pointer"
                    }
                    draggable={item.itemId != null ? "true" : "false"}>
                    {item.itemId != null ? input[item.itemId].val : "Drop here"}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="py-5 flex">
            <div
              onClick={handleReset}
              className="mx-8 px-10 py-2 rounded-lg cursor-pointer border-2 border-black active:bg-white active:text-black bg-black text-white text-lg font-semibold">
              Reset
            </div>
            <div
              onClick={handleSubmit}
              className="mx-8 px-10 py-2 rounded-lg cursor-pointer border-2 border-blue-700 active:bg-white active:text-blue-700 bg-blue-700 text-white text-lg font-semibold">
              SUBMIT
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DragAndDrop;
