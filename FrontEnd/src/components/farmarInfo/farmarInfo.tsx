import { IoLocationOutline } from "react-icons/io5"
import { storeData } from "../../constants/storeData"

const farmarInfo = () => {
  return (
    <div className="py-20 px-5 bg-white">

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Left Column (Store Info) - spans 2 columns */}
        <div className="col-span-1 lg:col-span-2 flex flex-col gap-4">
          <h2 className="text-3xl font-semibold mb-3">
            You can ask us questions!
          </h2>
          <p className="text-base text-gray-400 mb-5">
            Contact us for all your questions and opinions, or you can solve your
            problems faster with our contact offices.
          </p>

          {storeData.map((store) => (
            <div
              key={store.id}
              className="bg-gray-100 rounded-lg py-5 px-5 grid grid-cols-4 gap-2"
            >
              <div className="col-span-1 flex items-start justify-center">
                <div className="border-8 border-white rounded-full p-3 w-fit h-fit">
                  <IoLocationOutline className="text-primary text-2xl" />
                </div>
              </div>

              <div className="col-span-3 flex flex-col gap-1">
                <h3 className="font-bold text-base">{store.name}</h3>
                <p className="text-gray-400 text-sm">{store.address}</p>
                <span className="font-semibold text-sm mt-2">{store.phone}</span>
                <div>
                  <button className="cursor-pointer text-primary text-sm underline">
                    {store.email}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>


        <div className="col-span-1 lg:col-span-3 w-full">
          <div className="relative overflow-hidden" style={{ paddingTop: "56.25%" }}>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d28115.93521811777!2d85.34436592525037!3d27.692269507385717!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2snp!4v1778145688144!5m2!1sen!2snp"
              className="absolute top-0 left-0 w-full h-full border-0"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  )
}

export default farmarInfo
