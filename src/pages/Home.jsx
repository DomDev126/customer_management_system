import Profile from '../table/profile';
import Worklist from '../table/worklist';

const Home = () => {
    return (
        <div className='flex flex-col items-center justify-center gap-28 w-[80vw] p-10'>
            <h2 className='text-[30px] font-bold'>
                マイページ
            </h2>
            <div className='flex flex-col justify-center gap-4 w-full md:flex-row'>
                <Profile />
                <Worklist />
            </div>
        </div>
    )
}

export default Home;