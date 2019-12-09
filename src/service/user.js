import { searchByOpenId, getRecommendUser, getContactsList } from '@/api/data';
import { modifyPublicInfo } from '@/api/service';
import { response } from '@/utils/utils';

const searchUser = async openId => {
  return response(async function () {
    return await searchByOpenId(openId);
  });
};

const getRecommendUsers = async () => {
  return response(async function () {
    return await getRecommendUser();
  });
};

// 获取通讯录
const getContactsData = async openId => {
  return response(async function () {
    return await getContactsList(openId);
  });
};

const setModifyPublicInfo = async publicInfo => {
  return response(async function () {
    return await modifyPublicInfo(publicInfo);
  });
};

export default {
  searchUser,
  getRecommendUsers,
  getContactsData,
  setModifyPublicInfo,
};
