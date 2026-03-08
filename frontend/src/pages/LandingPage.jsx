import Button from '../components/Button'
import Navbar from '../components/Navbar'

const LandingPage = () => {
    return (
        <div className='flex flex-col h-screen overflow-y-auto hide-scrollbar'>
            <Navbar />

            {/* hero section */}
            <main className='flex items-center px-7 py-10 '>
                {/* div - contains the texts and buttons */}
                <div className='flex flex-col gap-2 justify-center h-86'>
                    <h1 className='text-4xl w-87.5'>
                        Create Amazing <span className='font-bold text-[#FF7A59]'>Projects</span> Together
                    </h1>

                    <p className='text-xl'>
                        Find teammates you can actually rely on. Bonded matches you with verified developers, designers & creators who share your work style and values.
                    </p>

                    <Button name="Get Started Now" bgColor="#2A6E8C" btnSize="25px"/>
                </div>

                {/* div - contains image */}
                <div className='w-4xl'>
                    <img src="/photo-1552664730-d307ca884978.jpeg" alt="team-image" srcset="" />
                </div>
            </main>

            {/* feature div */}
            <div className='flex flex-col gap-4'>
                {/* header div */}
                <div className='flex flex-col justify-center items-center'>
                    <h1 className='text-4xl'>
                        Features
                    </h1>

                    <p>
                        Contains all essential features that you need
                    </p>
                </div>

                {/* grid div to contain the feature cards */}
                <div className='grid-rows-3 max-w-[65%] m-auto'>
                    {/* div 1 - contains 3 features */}
                    <div className='flex max-w-full items-center justify-center'>
                        {/* feature - 1 */}
                        <div className='flex flex-col gap-3 justify-center px-2  h-44 hover:bg-sky-100 rounded-xs'>
                            <span className='w-fit px-1 py-0.5 rounded-xs bg-sky-300 text-sky-700'>
                                Collaborative
                            </span>

                            <p>
                                Create or join Teams of your batches, compete with other teams and build network.
                            </p>
                        </div>
                        {/* feature - 2 */}
                        <div className='flex flex-col gap-3 justify-center px-2 h-44 hover:bg-fuchsia-100 rounded-xs'>
                            <span className='w-fit px-1 py-0.5 rounded-xs bg-fuchsia-300 text-fuchsia-700'>
                                Focused Work
                            </span>

                            <p>
                                Team members focus on a single task at a time, reducing distractions and increasing productivity.
                            </p>
                        </div>
                        {/* feature - 3 */}
                        <div className='flex flex-col gap-3 justify-center px-2 h-44 hover:bg-lime-100 rounded-xs'>
                            <span className='w-fit px-1 py-0.5 rounded-xs bg-lime-300 text-lime-700'>
                                LeaderShip Skills
                            </span>

                            <p>
                                Enhance the Leadership and management skills by leading a Team which build job-ready skills.
                            </p>
                        </div>
                    </div>

                    {/* div 2 - contains 4 features */}
                    <div className='flex max-w-full items-center justify-center'>
                        {/* feature - 1 */}
                        <div className='flex flex-col gap-3 justify-center px-2 h-44 hover:bg-gray-100 rounded-xs'>
                            <span className='w-fit px-1 py-0.5 rounded-xs bg-gray-300 text-gray-700'>
                                Peer Reviews
                            </span>

                            <p>
                                Give and receive constructive feedback and learn by collaboration.
                            </p>
                        </div>
                        {/* feature - 2 */}
                        <div className='flex flex-col gap-3 justify-center px-2 h-44 hover:bg-blue-100 rounded-xs'>
                            <span className='w-fit px-1 py-0.5 rounded-xs bg-blue-300 text-blue-700'>
                                Join Request
                            </span>

                            <p>
                                Request multiple teams to join with transparent application tracking.
                            </p>
                        </div>
                        {/* feature - 3 */}
                        <div className='flex flex-col gap-3 justify-center px-2 h-44 hover:bg-orange-100 rounded-xs'>
                            <span className='w-fit px-1 py-0.5 rounded-xs bg-orange-300 text-orange-700'>
                                Management
                            </span>

                            <p>
                                Leader review application and add member base on skills and requirements.
                            </p>
                        </div>
                        {/* feature - 4 */}
                        <div className='flex flex-col gap-3 justify-center px-2 h-44 hover:bg-indigo-100 rounded-xs'>
                            <span className='w-fit px-1 py-0.5 rounded-xs bg-indigo-300 text-indigo-700'>
                                Activity History
                            </span>

                            <p>
                                All Users and Teams activity stored for future word and collaboration.
                            </p>
                        </div>
                    </div>

                    {/* div 3 - contains 2 features */}
                    <div className='flex max-w-full items-center justify-center'>
                        {/* feature - 1 */}
                        <div className='flex flex-col gap-3 justify-center px-2 h-44 hover:bg-red-100 rounded-xs'>
                            <span className='w-fit px-1 py-0.5 rounded-xs bg-red-300 text-red-700'>
                                Proof of work
                            </span>

                            <p>
                                Everything you create builds a public portfolio you can proudly share with others.
                            </p>
                        </div>
                        {/* feature - 2 */}
                        <div className='flex flex-col gap-3 justify-center px-2 h-44 hover:bg-teal-100 rounded-xs'>
                            <span className='w-fit px-1 py-0.5 rounded-xs bg-teal-300 text-teal-700'>
                                Recommendation
                            </span>

                            <p>
                                Work hard and get recommended by your Batch Teachers and stand out from crowd.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* footer */}
            <div className='flex flex-col justify-center items-center bg-slate-900 mt-4 py-20'>
                <div>
                    <h1 className='font-bold text-2xl'>
                        Bonded
                    </h1>
                </div>

                <div>
                    <span className='text-gray-700'>
                        Thanks for using😸
                    </span>
                </div>
            </div>
        </div>
    )
}

export default LandingPage
