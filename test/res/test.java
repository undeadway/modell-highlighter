package com.sgcc.uvmp.running.repository.impl;

import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.sgcc.uvmp.pojo.GridResult;
import com.sgcc.uvmp.repository.BaseRepositorySupport;
import com.sgcc.uvmp.running.po.UvmpRecDriver;
import com.sgcc.uvmp.running.repository.IExcelExportsRepository;
import com.sgcc.uvmp.running.repository.IUvmpRecDriverRepository;

@Repository
public class UvmpRecDriverRepository
		// 20190514 Excel导出（驾驶员） 修改：开始
		implements IExcelExportsRepository
		// 20190514 Excel导出（驾驶员） 修改：结束
{

	private BaseRepositorySupport<UvmpRecDriver> baseRepositorySupport;

	public UvmpRecDriver findOneById(String id) {
		UvmpRecDriver uvmpRecDriver = this.baseRepositorySupport.findOneById(id);
		return uvmpRecDriver;
	}

	public GridResult<UvmpRecDriver> findPageBySQL(UvmpRecDriver uvmpRecDriver) {
		return this.baseRepositorySupport.findPageWithConditionBySQL("selectByParamsByPage", uvmpRecDriver);
	}

	public UvmpRecDriver saveUvmpRecDriver(UvmpRecDriver uvmpRecDriver) {
		return this.baseRepositorySupport.save(uvmpRecDriver);
	}

	public void delete(String id) {
		this.baseRepositorySupport.delete(id);
	}

	public List findAllWithConditionBySQL(Map<String, Object> paramsMap) {
		return this.baseRepositorySupport.findAllWithConditionBySQL("selectByParamsForExportByPage", paramsMap);
	}

	@Autowired
	public UvmpRecDriverRepository(IUvmpRecDriverRepository iUvmpRecDriverRepository,
			BaseRepositorySupport<UvmpRecDriver> baseRepositorySupport) {
		this.baseRepositorySupport = baseRepositorySupport;
		this.baseRepositorySupport.setCustomRepository(iUvmpRecDriverRepository);
		this.baseRepositorySupport.setNamespace("com.sgcc.uvmp.repository.UvmpRecDriverMapper");
	}

	public GridResult<UvmpRecDriver> queryUnbindDriverFindPageBySQL(UvmpRecDriver uvmpRecDriver) {
		// 返回值为map类型的分页查询 用于多表查询
		GridResult<UvmpRecDriver> result = this.baseRepositorySupport
				.findPageWithConditionBySQL("selectUnbindDriverByPage", uvmpRecDriver);
		return result;
	}

	// 查询绑定的驾驶员
	public GridResult<UvmpRecDriver> queryBindDriver(UvmpRecDriver uvmpRecDriver) {
		// 返回值为map类型的分页查询 用于多表查询
		GridResult<UvmpRecDriver> result = this.baseRepositorySupport
				.findPageWithConditionBySQL("selectbindDriverByPage", uvmpRecDriver);
		return result;
	}

	// 车队查询未绑定的驾驶员
	public GridResult<UvmpRecDriver> queryUnbindDriverTeamBySQL(Map<String, Object> paramsMap) {
		return this.baseRepositorySupport.findPageWithConditionBySQL("queryUnbindDriverTeamByPage", paramsMap);
	}

	// 车队查询已绑定驾驶员
	public GridResult<UvmpRecDriver> queryBindDriverTeamBySQL(Map<String, Object> paramsMap) {
		return this.baseRepositorySupport.findPageWithConditionBySQL("queryBindDriverTeamByPage", paramsMap);
	}

	// 20190514 Excel导出（驾驶员） 新增：开始
	@SuppressWarnings("rawtypes")
	@Override
	public List getDataForExportExcel(Map<String, Object> paramsMap) {
		return this.baseRepositorySupport.findAllWithConditionBySQL("uvmpRecDriverExcelExports", paramsMap);
	}
	// 20190514 Excel导出（驾驶员） 新增：结束
}
