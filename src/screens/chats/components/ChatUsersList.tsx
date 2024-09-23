import React, { useEffect, useState } from "react";
import { getChatroomId } from "@/src/utils/getChatId";
import { chatApi } from "@/src/services/api/chatApi";
import { useAppSelector } from "@/src/services/hooks/useAppSelector";
import { useAppDispatch } from "@/src/services/hooks/useAppDispatch";
import { View, Button } from "react-native";
import ChattedUser from "@/src/models/ChattedUser";
import ChatUserBox from "./ChatUserBox";
import { FlashList } from "@shopify/flash-list";
import { userApi } from "@/src/services/api/userApi";
import { localUserDb } from "@/src/services/db/localUserDb";
import { localChatDb } from "@/src/services/db/localChatDb";
import {
  setMyChatrooms,
  setChattedUsers,
  setCurrentChatroomId,
  setCurrentChatroomUser,
} from "@/src/redux/reducers/chatroomReducer";

const ChatUsersList = ({ navigation }: { navigation: any }) => {
  const dispatch = useAppDispatch();
  const { currentUser } = useAppSelector((state) => state.user);
  const { homeScreenSearchQuery, hasInternetConnection } = useAppSelector(
    (state) => state.global
  );
  const { chattedUsers } = useAppSelector((state) => state.chatroom);
  const [sortedChattedUsers, setSortedChattedUsers] = useState<
    Partial<ChattedUser>[]
  >([]);

  const fetchChattedUsers = async (rawChattedUsers: string[]) => {
    if (!hasInternetConnection) {
      const ChattedUsersDataLocal = [];
      for (const rawChattedUser of rawChattedUsers) {
        const [
          userId,
          lastMessage,
          lastMessageSentAt,
          lastMessageId,
          lastMessageSenderId,
          isSeen,
        ] = rawChattedUser.split("|_+_|");

        try {
          const ChattedUserLocal = await localUserDb.getChattedUserDataById(
            userId
          );

          if (ChattedUserLocal) {
            const ChattedUserData = {
              userId: userId || "",
              lastMessage: lastMessage || "",
              lastMessageSentAt: lastMessageSentAt || "",
              lastMessageId: lastMessageId || "",
              lastMessageSenderId: lastMessageSenderId || "",
              lastMessageIsSeen: isSeen === "true" ? true : false,
              name: ChattedUserLocal?.name || "",
              about: ChattedUserLocal?.about || "",
              phoneNumber: ChattedUserLocal?.phoneNumber || "",
              createdAt: ChattedUserLocal?.createdAt || "",
              lastSeenAt: ChattedUserLocal?.lastSeenAt || "",
              email: ChattedUserLocal?.email || "",
              username: ChattedUserLocal?.username || "",
              profileAvatarUrl: ChattedUserLocal?.profileAvatarUrl || "",
              isOnline: ChattedUserLocal?.isOnline || false,
              isVerified: ChattedUserLocal?.isVerified || false,
            };
            ChattedUsersDataLocal.push(ChattedUserData);
          }
        } catch (error) {
          return {};
        }
      }
      dispatch(setChattedUsers(ChattedUsersDataLocal));
    }

    if (hasInternetConnection) {
      const ChattedUsersDataApi = [];
      for (const rawChattedUser of rawChattedUsers) {
        const [
          userId,
          lastMessage,
          lastMessageSentAt,
          lastMessageId,
          lastMessageSenderId,
          isSeen,
        ] = rawChattedUser.split("|_+_|");

        try {
          const ChattedUserApi = await userApi.fetchUserDocumentById(userId);

          if (ChattedUserApi) {
            const ChattedUserData = {
              userId: userId || "",
              lastMessage: lastMessage || "",
              lastMessageSentAt: lastMessageSentAt || "",
              lastMessageId: lastMessageId || "",
              lastMessageSenderId: lastMessageSenderId || "",
              lastMessageIsSeen: isSeen === "true" ? true : false,
              name: ChattedUserApi?.name || "",
              about: ChattedUserApi?.about || "",
              phoneNumber: ChattedUserApi?.phoneNumber || "",
              createdAt: ChattedUserApi?.createdAt || "",
              lastSeenAt: ChattedUserApi?.lastSeenAt || "",
              email: ChattedUserApi?.email || "",
              username: ChattedUserApi?.username || "",
              profileAvatarUrl: ChattedUserApi?.profileAvatarUrl || "",
              isOnline: ChattedUserApi?.isOnline || false,
              isVerified: ChattedUserApi?.isVerified || false,
            };
            ChattedUsersDataApi.push(ChattedUserData);
          }
        } catch (error) {
          return {};
        }
      }
      dispatch(setChattedUsers(ChattedUsersDataApi));
      await localUserDb.upsertChattedUsersData(ChattedUsersDataApi);
    }
  };

  useEffect(() => {
    const fetchMyChatrooms = async () => {
      const myChatroomsLocal = await localChatDb.getMyChatroomsData();

      if (myChatroomsLocal) {
        dispatch(setMyChatrooms(myChatroomsLocal));
        fetchChattedUsers(myChatroomsLocal.chattedUsers || []);
      }
      if (hasInternetConnection) {
        const myChatroomsApi = await chatApi.fetchMyChatRoomsDocument();
        if (myChatroomsApi) {
          dispatch(setMyChatrooms(myChatroomsApi));
          await localChatDb.upsertChatroomsData(myChatroomsApi);
          fetchChattedUsers(myChatroomsApi.chattedUsers || []);
        }
      }
    };

    fetchMyChatrooms();
  }, [currentUser]);

  useEffect(() => {
    const sortedChattedUsers = chattedUsers
      .map((chattedUser: Partial<ChattedUser>) => {
        const chatroomId = getChatroomId(
          currentUser?.userId,
          chattedUser.userId!
        );
        return { chattedUser };
      })
      .filter(({ chattedUser }: { chattedUser: Partial<ChattedUser> }) =>
        chattedUser.name
          ?.toLowerCase()
          .startsWith(homeScreenSearchQuery.toLowerCase())
      )
      .sort(
        (
          a: { chattedUser: Partial<ChattedUser> },
          b: { chattedUser: Partial<ChattedUser> }
        ) => {
          const timeA = Number(a.chattedUser.lastMessageSentAt) || 0;
          const timeB = Number(b.chattedUser.lastMessageSentAt) || 0;
          return timeB - timeA;
        }
      )
      .map(
        ({ chattedUser }: { chattedUser: Partial<ChattedUser> }) => chattedUser
      );

    setSortedChattedUsers(sortedChattedUsers);
  }, [homeScreenSearchQuery, chattedUsers]);

  useEffect(() => {
    if (hasInternetConnection) {
      let unsubscribe: (() => void) | null = null;

      if (currentUser?.userId) {
        unsubscribe = chatApi.subscribeToMyChatroomsDocumentChanges(
          currentUser.userId,
          async (updatedChatrooms) => {
            dispatch(setMyChatrooms(updatedChatrooms));
            fetchChattedUsers(updatedChatrooms.chattedUsers || []);
            await localChatDb.upsertChatroomsData(updatedChatrooms);
          }
        );
      }

      return () => {
        if (unsubscribe) {
          unsubscribe();
        }
      };
    }
  }, [currentUser?.userId, setMyChatrooms]);

  const renderItem = ({ item }: { item: Partial<ChattedUser> }) => {
    if (!item) {
      return null;
    }
    return (
      <ChatUserBox
        chattedUser={item}
        chatroomId={getChatroomId(currentUser?.userId, item.userId!)}
        onPress={() => {
          dispatch(setCurrentChatroomUser(item));
          dispatch(
            setCurrentChatroomId(
              getChatroomId(currentUser?.userId, item.userId!)
            )
          );
          navigation.navigate("Chat");
        }}
      />
    );
  };

  return (
    <FlashList
      data={sortedChattedUsers as Partial<ChattedUser>[]}
      keyExtractor={(item) => item.userId!}
      renderItem={renderItem}
      estimatedItemSize={100}
    />
  );
};

export default React.memo(ChatUsersList);
