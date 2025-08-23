import { HashRouter as Router, Routes, Route } from "react-router-dom"
import Home from "./Home"
import SecondaryPage from "./secondary_page"
import Pages from "./Pages"

import Money from "../src/Documents/Logs/Money/Money"
import CrashOutDoc from "../src/Documents/Logs/CrashOutDoc/CrashOutDoc"
import Dreams from "../src/Documents/Logs/Dreams/Dreams"
import Goals from "../src/Documents/Logs/Goals/Goals"
import Compliments from "../src/Documents/Logs/Compliments/Compliments"
import RunningLog from "../src/Documents/Logs/RunningLog/RunningLog"
import Summer2025 from "../src/Documents/Logs/Summer2025/Summer2025"

import BiggestThanks2022 from "../src/Documents/Daily/BiggestThanks2022/BiggestThanks2022"
import BiggestThanks2023 from "../src/Documents/Daily/BiggestThanks2023/BiggestThanks2023"
import EnormousThanks2024 from "../src/Documents/Daily/EnormousThanks2024/EnormousThanks2024"
import LargestGratitudes2025 from "../src/Documents/Daily/LargestGratitudes2025/LargestGratitudes2025"
import JournalPrompts1 from "../src/Documents/Daily/JournalPrompts1/JournalPrompts1"
import JournalPrompts2 from "../src/Documents/Daily/JournalPrompts2/JournalPrompts2"

import Bible2023 from "../src/Documents/Jesus/Bible2023/Bible2023"
import Bible2024 from "../src/Documents/Jesus/Bible2024/Bible2024"
import Devotions2025 from "../src/Documents/Jesus/Devotions2025/Devotions2025"
import Friends70BibleStudy from "../src/Documents/Jesus/Friends7.0BibleStudy/Friends7.0BibleStudy"
import Prayer from "../src/Documents/Jesus/Prayer/Prayer"

import WishList from "../src/Documents/Lists/WishList/WishList"
import ShoppingList from "../src/Documents/Lists/ShoppingList/ShoppingList"
import BucketList from "../src/Documents/Lists/BucketList/BucketList"
import ChristmasShoppingLists from "../src/Documents/Lists/ChristmasShoppingLists/ChristmasShoppingLists"
import AnimeList from "../src/Documents/Lists/AnimeList/AnimeList"
import BooksCompleted from "../src/Documents/Lists/BooksCompleted/BooksCompleted"
import GamesCompleted from "../src/Documents/Lists/GamesCompleted/GamesCompleted"
import Regrets from "../src/Documents/Lists/Regrets/Regrets"
import WaterDrop from "../src/Documents/Lists/Cry/Cry"
import Subscriptions from "../src/Documents/Lists/Subscriptions/Subscriptions"
import Favorites from "../src/Documents/Lists/Favorites/Favorites"
import IWishICould from "../src/Documents/Lists/IWishICould/IWishICould"
import BubbleBubbleBubble from "../src/Documents/Lists/BubbleBubbleBubble/BubbleBubbleBubble"
import Insecurities from "../src/Documents/Lists/Insecurities/Insecurities"
import UrSummerChecklist from "../src/Documents/Lists/UrSummerChecklist/UrSummerChecklist"
import BenSummerChecklist from "../src/Documents/Lists/BenSummerChecklist/BenSummerChecklist"
import LeosSummerChecklist from "../src/Documents/Lists/LeosSummerChecklist/LeosSummerChecklist"

import UnsuspiciousDocument1 from "../src/Documents/UnsuspiciousDocuments/UnsuspiciousDocument1/UnsuspiciousDocument1"
import UnsuspiciousDocument2 from "../src/Documents/UnsuspiciousDocuments/UnsuspiciousDocument2/UnsuspiciousDocument2"
import UnsuspiciousDocument3 from "../src/Documents/UnsuspiciousDocuments/UnsuspiciousDocument3/UnsuspiciousDocument3"
import UnsuspiciousDocument4 from "../src/Documents/UnsuspiciousDocuments/UnsuspiciousDocument4/UnsuspiciousDocument4"

import TheDailyStuffs from "../src/Documents/Planners/TheDailyStuffs/TheDailyStuffs"
import ToDo from "../src/Documents/Planners/ToDo/ToDo"
import WeekAtAGlance from "../src/Documents/Planners/WeekAtAGlance/WeekAtAGlance"

import LettersToSelfs from "../src/Documents/NewYearsThings/LettersToSelfs/LettersToSelfs"
import NewYearsResolutions from "../src/Documents/NewYearsThings/NewYearsResolutions/NewYearsResolutions"

import Amke2024ShouldIGo from "../src/Documents/ProsAndCons/Amke2024ShouldIGo/Amke2024ShouldIGo"
import HowWhyIrinaFriendship from "../src/Documents/ProsAndCons/HowWhyIrinaFriendShip/HowWhyIrinaFriendShip"
import MysoQuittingProsAndCons from "../src/Documents/ProsAndCons/MysoQuittingProsAndCons/MysoQuittingProsAndCons"
import ProsAndConsVbXc from "../src/Documents/ProsAndCons/ProsAndConsVbXc/ProsAndConsVbXc"
import ProsConsTrack from "../src/Documents/ProsAndCons/ProsConsTrack/ProsConsTrack"



export default function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />

                {Pages.map(page => (
                <Route
                    key={page.path}
                    path={page.path}
                    element={
                    <SecondaryPage 
                        title={page.title} 
                        description={page.description} 
                        example={page.example} 
                        category={page.category}
                    />
                    }
                />
                ))}

                <Route path="/logs/money" element={<Money />} />
                <Route path="/logs/crashOutDoc" element={<CrashOutDoc />} />
                <Route path="/logs/dreams" element={<Dreams />} />
                <Route path="/logs/goals" element={<Goals />} />
                <Route path="/logs/compliments" element={<Compliments />} />
                <Route path="/logs/runningLog" element={<RunningLog />} />
                <Route path="/logs/summer2025" element={<Summer2025 />} />

                <Route path="/daily/BiggestThanks2022" element={<BiggestThanks2022 />} />
                <Route path="/daily/BiggestThanks2023" element={<BiggestThanks2023 />} />
                <Route path="/daily/EnormousThanks2024" element={<EnormousThanks2024 />} />
                <Route path="/daily/LargestGratitudes2025" element={<LargestGratitudes2025 />} />
                <Route path="/daily/JournalPrompts1" element={<JournalPrompts1 />} />
                <Route path="/daily/JournalPrompts2" element={<JournalPrompts2 />} />

                <Route path="/jesus/Bible2023" element={<Bible2023 />} />
                <Route path="/jesus/Bible2024" element={<Bible2024 />} />
                <Route path="/jesus/Devotions2025" element={<Devotions2025 />} />
                <Route path="/jesus/FriendsBibleStudy7" element={<Friends70BibleStudy />} />
                <Route path="/jesus/Prayer" element={<Prayer />} />

                <Route path="/lists/wishList" element={<WishList />} />
                <Route path="/lists/shoppingList" element={<ShoppingList />} />
                <Route path="/lists/bucketList" element={<BucketList />} />
                <Route path="/lists/christmasShoppingLists" element={<ChristmasShoppingLists />} />
                <Route path="/lists/animeList" element={<AnimeList />} />
                <Route path="/lists/booksCompleted" element={<BooksCompleted />} />
                <Route path="/lists/gamesCompleted" element={<GamesCompleted />} />
                <Route path="/lists/regrets" element={<Regrets />} />
                <Route path="/lists/waterDrop" element={<WaterDrop />} />
                <Route path="/lists/subscriptions" element={<Subscriptions />} />
                <Route path="/lists/favorites" element={<Favorites />} />
                <Route path="/lists/wishICould" element={<IWishICould />} />
                <Route path="/lists/bubbleBubbleBubble" element={<BubbleBubbleBubble />} />
                <Route path="/lists/insecurities" element={<Insecurities />} />
                <Route path="/lists/urSummerChecklist" element={<UrSummerChecklist />} />
                <Route path="/lists/benSummerChecklist" element={<BenSummerChecklist />} />
                <Route path="/lists/leoSummerChecklist2024" element={<LeosSummerChecklist />} />

                <Route path="/unsuspiciousDocuments/unsuspiciousDocument1" element={<UnsuspiciousDocument1 />} />
                <Route path="/unsuspiciousDocuments/unsuspiciousDocument2" element={<UnsuspiciousDocument2 />} />
                <Route path="/unsuspiciousDocuments/unsuspiciousDocument3" element={<UnsuspiciousDocument3 />} />
                <Route path="/unsuspiciousDocuments/unsuspiciousDocument4" element={<UnsuspiciousDocument4 />} />

                <Route path="/planners/theDailyStuffs" element={<TheDailyStuffs />} />
                <Route path="/planners/weekAtAGlance" element={<WeekAtAGlance />} />
                <Route path="/planners/toDo" element={<ToDo />} />   

                <Route path="/newYearsThings/newYearsResolutions" element={<NewYearsResolutions />} />
                <Route path="/newYearsThings/lettersToSelfs" element={<LettersToSelfs />} /> 

                <Route path="/lists/prosAndConsVbXc" element={<ProsAndConsVbXc />} />
                <Route path="/lists/howWhyIrinaFriendship" element={<HowWhyIrinaFriendship />} />
                <Route path="/lists/mysoQuittingProsCons" element={<MysoQuittingProsAndCons />} />
                <Route path="/lists/prosConsTrack" element={<ProsConsTrack />} />
                <Route path="/lists/amke2024ShouldIGo" element={<Amke2024ShouldIGo />} />  

            </Routes>
        </Router>
    )
}