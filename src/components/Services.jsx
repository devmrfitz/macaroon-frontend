import React from "react";
import { BsShieldFillCheck } from "react-icons/bs";
import { BiSearchAlt } from "react-icons/bi";
import { RiHeart2Fill } from "react-icons/ri";

function ServiceCard({ color, title, icon, subtitle }) {
  return (<div className="flex flex-row justify-start items-start white-glassmorphism p-3 m-2 cursor-pointer hover:shadow-xl w-full">
      <div className={`w-10 h-10 rounded-full flex justify-center items-center ${color}`}>
          {icon}
      </div>

      <div className="ml-5 flex flex-col flex-1">
          <h3 className="mt-2 text-white text-lg">
              {title}
          </h3>

          <p className="mt-1 text-white text-sm md:w-9/12">
              {subtitle}
          </p>
      </div>
  </div>)
}

function Services() {
  return (<div className="flex w-full justify-center items-center gradient-bg-services">
      <div className="flex mf:flex-row flex-col items-center justify-between md:p-20 py-12 px-4">
          <div className="flex-1 flex flex-col justify-start items-start">
              <h1 className="text-white text-3xl sm:text-5xl py-2 text-gradient ">
                  The beauty
                  <br />
                  of blockchain
              </h1>

              <p className="text-left my-2 text-white font-light md:w-9/12 w-11/12 text-base">
                  We use blockchain powered transactions with improved security, complete transparency and full control over the money you spend
              </p>
          </div>

          <div className="flex-1 flex flex-col justify-start items-center">
              <ServiceCard
                  color="bg-[#2952E3]"
                  icon={<BsShieldFillCheck
                      className="text-white"
                      fontSize={21}
                        />}
                  subtitle="Trust no-one but the code"
                  title="Security guarantee"
              />

              <ServiceCard
                  color="bg-[#8945F8]"
                  icon={<BiSearchAlt
                      className="text-white"
                      fontSize={21}
                        />}
                  subtitle="Don't know much about crypto? No problem"
                  title="No hassles"
              />

              <ServiceCard
                  color="bg-[#F84550]"
                  icon={<RiHeart2Fill
                      className="text-white"
                      fontSize={21}
                        />}
                  subtitle="Your transactions outlive Macaroon"
                  title="0 downtime, literally"
              />
          </div>
      </div>
  </div>)
}

export default Services;
