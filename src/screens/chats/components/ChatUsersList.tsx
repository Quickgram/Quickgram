import React, { useEffect, useState } from "react";
import { getChatroomId } from "@/src/utils/getChatId";
import { chatApi } from "@/src/services/api/chatApi";
import { useAppSelector } from "@/src/services/hooks/useAppSelector";
import { useAppDispatch } from "@/src/services/hooks/useAppDispatch";
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
  const { chattedUsers, currentChatroomUser } = useAppSelector(
    (state) => state.chatroom
  );
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
          const additionalChattedUserDataApi =
            await userApi.fetchUserDocumentById(userId);

          if (additionalChattedUserDataApi) {
            const ChattedUserData = {
              userId: userId || "",
              lastMessage: lastMessage || "",
              lastMessageSentAt: lastMessageSentAt || "",
              lastMessageId: lastMessageId || "",
              lastMessageSenderId: lastMessageSenderId || "",
              lastMessageIsSeen: isSeen === "true" ? true : false,
              name: additionalChattedUserDataApi?.name || "",
              about: additionalChattedUserDataApi?.about || "",
              phoneNumber: additionalChattedUserDataApi?.phoneNumber || "",
              createdAt: additionalChattedUserDataApi?.createdAt || "",
              lastSeenAt: additionalChattedUserDataApi?.lastSeenAt || "",
              email: additionalChattedUserDataApi?.email || "",
              username: additionalChattedUserDataApi?.username || "",
              profileAvatarUrl:
                additionalChattedUserDataApi?.profileAvatarUrl || "",
              isOnline: additionalChattedUserDataApi?.isOnline || false,
              isVerified: additionalChattedUserDataApi?.isVerified || false,
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

  useEffect(() => {
    if (hasInternetConnection && chattedUsers.length > 0) {
      const unsubscribe = userApi.subscribeToUsersDocumentChanges(
        async (updatedUser) => {
          if (!updatedUser || !updatedUser.userId) return;

          let hasChanges = false;
          const updatedChattedUsers = chattedUsers.map(
            (chattedUser: Partial<ChattedUser>) => {
              if (chattedUser.userId === updatedUser.userId) {
                const updatedFields = {
                  name: updatedUser.name ?? chattedUser.name,
                  about: updatedUser.about ?? chattedUser.about,
                  phoneNumber:
                    updatedUser.phoneNumber ?? chattedUser.phoneNumber,
                  createdAt: updatedUser.createdAt ?? chattedUser.createdAt,
                  lastSeenAt: updatedUser.lastSeenAt ?? chattedUser.lastSeenAt,
                  email: updatedUser.email ?? chattedUser.email,
                  username: updatedUser.username ?? chattedUser.username,
                  profileAvatarUrl:
                    updatedUser.profileAvatarUrl ??
                    chattedUser.profileAvatarUrl,
                  isOnline: updatedUser.isOnline ?? chattedUser.isOnline,
                  isVerified: updatedUser.isVerified ?? chattedUser.isVerified,
                };

                if (
                  Object.keys(updatedFields).some(
                    (key) =>
                      updatedFields[key as keyof typeof updatedFields] !==
                      chattedUser[key as keyof typeof chattedUser]
                  )
                ) {
                  hasChanges = true;
                  return { ...chattedUser, ...updatedFields };
                }
              }
              return chattedUser;
            }
          );

          if (hasChanges) {
            dispatch(setChattedUsers(updatedChattedUsers));
            await localUserDb.upsertChattedUsersData(updatedChattedUsers);

            if (
              currentChatroomUser &&
              currentChatroomUser.userId === updatedUser.userId
            ) {
              const updatedCurrentChatroomUser = {
                ...currentChatroomUser,
                name: updatedUser.name ?? currentChatroomUser.name,
                about: updatedUser.about ?? currentChatroomUser.about,
                phoneNumber:
                  updatedUser.phoneNumber ?? currentChatroomUser.phoneNumber,
                createdAt:
                  updatedUser.createdAt ?? currentChatroomUser.createdAt,
                lastSeenAt:
                  updatedUser.lastSeenAt ?? currentChatroomUser.lastSeenAt,
                email: updatedUser.email ?? currentChatroomUser.email,
                username: updatedUser.username ?? currentChatroomUser.username,
                profileAvatarUrl:
                  updatedUser.profileAvatarUrl ??
                  currentChatroomUser.profileAvatarUrl,
                isOnline: updatedUser.isOnline ?? currentChatroomUser.isOnline,
                isVerified:
                  updatedUser.isVerified ?? currentChatroomUser.isVerified,
              };
              dispatch(setCurrentChatroomUser(updatedCurrentChatroomUser));
            }
          }
        }
      );

      return () => {
        if (unsubscribe) {
          unsubscribe();
        }
      };
    }
  }, [hasInternetConnection, chattedUsers, dispatch, currentChatroomUser]);

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
      keyboardDismissMode="on-drag"
    />
  );
};

export default React.memo(ChatUsersList);
