<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    class="dialog"
    :fullscreen="true"
    @open="getFormData"
    @close="closeDialog"
  >
      <el-form
        ref="form"
        :model="form"
        :rules="rules"
        :inline="inline"
        :label-suffix="labelSuffix"
        :label-width="labelWidth"
        :label-position="labelPosition"
        :status-icon="statusIcon"
        :size="size"
        :hide-required-asterisk="hideRequiredAsterisk"
        @submit.native.prevent
      >
        <el-tabs
        v-model="formLayout.tabs_1wvn8y5"
        type="border-card"
        tab-position="top"
        :stretch="false"
        class="ibps-mb-10"
      >
      <el-tab-pane name="tab1">
          <span slot="label">标签页1</span>
          
      <el-row
        :gutter="0"
        justify="start"
        align="top"
        class="widget-col"
        type="flex"
      >
      <el-col :span="12">
        
      <el-form-item
      label="多行文本"
      
      prop="duoXingWenBen"><el-input
      v-model="form.duoXingWenBen"
      placeholder="请输入"
      type="text"
      name="duoXingWenBen"
      :autosize="autosize"
      :rows="3"
      :readonly="readonly"
      clearable
      :style="{width:width}"
    /> 
      </el-form-item>
    
        </el-col>
        <el-col :span="12">
        
      <el-form-item
      label="计数器"
      
      prop="jiShuQi"><el-input-number
      v-model="form.jiShuQi"
      :max="35"
      :min="0"
      :step="1"
      :controls="true"
      controls-position=""
      placeholder="请输入"
      :disabled="readonly"
      :style="{width:width}"
    />
      </el-form-item>
    
        </el-col>
        
      </el-row>
      
          </el-tab-pane>
          <el-tab-pane name="tab2">
          <span slot="label">标签页2</span>
          
      <el-row
        :gutter="0"
        justify="start"
        align="top"
        class="widget-col"
        type="flex"
      >
      <el-col :span="12">
        
      <el-form-item
      label="下拉框"
      
      prop="xiaLaKuang">
    <el-select
      v-model="form.xiaLaKuang"
      placeholder="请选择类型"
      name="xiaLaKuang"
      :disabled="readonly"
      :style="{width:width}"
      clearable
    >
    
        <el-option
          key="1"
          label="选项一"
          value="1"
        />
        <el-option
          key="2"
          label="选项二"
          value="2"
        />
        
    </el-select>
      </el-form-item>
    
        </el-col>
        <el-col :span="12">
        
      <el-form-item
      label="日期"
      
      prop="riQi"><el-date-picker
        v-model="form.riQi"
        type="date"
        value-format="yyyy-MM-dd HH:mm:ss"
        format="yyyy-MM-dd"
        placeholder="请选择"
        :style="{width:width}"
        :readonly="readonly"
        :clearable="false"
      />
      </el-form-item>
    
        </el-col>
        
      </el-row>
      
          </el-tab-pane>
          
      </el-tabs>
      
      <el-form-item
      label=""
      label-width="0"
      prop="dmsczbydy">
    <div class="dynamic-form-table">
  
      <div class="dynamic-form-table__inner panel panel-info">
        <div class="panel-heading ibps-clearfix">
          <div class="ibps-fl dynamic-form-table__label">代码生成子表一对一:V1</div>
      
          <div class="ibps-fr hidden-print">
            <el-button-group>
            
                <el-button
                :key="0"
                :hidden="readonly"
                type="primary"
                icon="ibps-icon-add"
                @click="handleActionEvent('add','dmsczbydyPoList','dmsczbydyPoList')"
              >
                添加
              </el-button>
                <el-button
                :key="1"
                :hidden="readonly"
                type="danger"
                icon="ibps-icon-remove"
                @click="handleActionEvent('remove','dmsczbydyPoList','dmsczbydyPoList')"
              >
                删除
              </el-button>
            </el-button-group>
          </div>
      
        </div>
        <div class="panel-body">
          <el-table
            ref="dmsczbydyPoList"
            :data="form.dmsczbydyPoList"
            border
            stripe
          >
            <el-table-column
              type="selection"
              width="50"
            />
            <el-table-column
                type="index"
                label="序号"
                width="50"
              />
        <el-table-column
          :key="0"
          prop="tenantId"
          
        >
          <template slot="header">
            租户ID
            
          </template>
          <template slot-scope="props">
            
    <el-form-item
      prop="tenantId"
      
      label-width="0px"
      :class="{
        'dynamic-form-table-item__readonly':readonly
      }"
    >
  <el-input
      v-model="props.row.tenantId"
      placeholder="请输入"
      type="text"
      name="tenantId"
      :autosize="autosize"
      :rows="3"
      :readonly="readonly"
      clearable
      :style="{width:width}"
    /> 
    </el-form-item>
  
          </template>
        </el-table-column>
      
        <el-table-column
          :key="1"
          prop="ziBiaoRiQi1"
          
        >
          <template slot="header">
            子表日期1
            
          </template>
          <template slot-scope="props">
            
    <el-form-item
      prop="ziBiaoRiQi1"
      
      label-width="0px"
      :class="{
        'dynamic-form-table-item__readonly':readonly
      }"
    >
  <el-date-picker
        v-model="props.row.ziBiaoRiQi1"
        type="date"
        value-format="yyyy-MM-dd HH:mm:ss"
        format="yyyy-MM-dd"
        placeholder="请选择"
        :style="{width:width}"
        :readonly="readonly"
        :clearable="false"
      />
    </el-form-item>
  
          </template>
        </el-table-column>
      
        <el-table-column
          :key="2"
          prop="ziBiaoXiaoShu1"
          
        >
          <template slot="header">
            子表小数1
            
          </template>
          <template slot-scope="props">
            
    <el-form-item
      prop="ziBiaoXiaoShu1"
      
      label-width="0px"
      :class="{
        'dynamic-form-table-item__readonly':readonly
      }"
    >
  <el-input
      v-model="props.row.ziBiaoXiaoShu1"
      placeholder="请输入"
      type="number"
      name="ziBiaoXiaoShu1"
      :autosize="autosize"
      :rows="3"
      :readonly="readonly"
      clearable
      @keypress="channelInputLimit"
      :style="{width:width}"
    /> 
    </el-form-item>
  
          </template>
        </el-table-column>
      
        <el-table-column
          :key="3"
          prop="ziBiaoDuoXuan1"
          
        >
          <template slot="header">
            子表多选1
            
          </template>
          <template slot-scope="props">
            
    <el-form-item
      prop="ziBiaoDuoXuan1"
      
      label-width="0px"
      :class="{
        'dynamic-form-table-item__readonly':readonly
      }"
    >
  <el-checkbox-group
          v-model="props.row.ziBiaoDuoXuan1"
          :disabled="readonly"
          
        > 
        
          <component
          :is="'el-checkbox'"
          :label="'1'"
          class="ibps-pt-5"
        >
          选项一
        </component>
          <component
          :is="'el-checkbox'"
          :label="'2'"
          class="ibps-pt-5"
        >
          选项二
        </component>
      </el-checkbox-group>
    </el-form-item>
  
          </template>
        </el-table-column>
      
        <el-table-column
          :key="4"
          prop="ip"
          
        >
          <template slot="header">
            开关
            
          </template>
          <template slot-scope="props">
            
    <el-form-item
      prop="ip"
      
      label-width="0px"
      :class="{
        'dynamic-form-table-item__readonly':readonly
      }"
    >
  
        <el-switch
          v-model="props.row.ip"
          active-value="Y"
          inactive-value="N"
          active-text="开"
          inactive-text="关"
          active-color="#90EE90"
          inactive-color="#FF4500"
          :disabled="readonly"
        />
    </el-form-item>
  
          </template>
        </el-table-column>
      
        <el-table-column
          :key="5"
          prop="updateBy"
          
        >
          <template slot="header">
            单选
            
          </template>
          <template slot-scope="props">
            
    <el-form-item
      prop="updateBy"
      
      label-width="0px"
      :class="{
        'dynamic-form-table-item__readonly':readonly
      }"
    >
  <el-radio-group
          v-model="props.row.updateBy"
          :disabled="readonly"
          
        > 
        
          <component
          :is="'el-radio'"
          :label="'1'"
          class="ibps-pt-5"
        >
          选项一
        </component>
          <component
          :is="'el-radio'"
          :label="'2'"
          class="ibps-pt-5"
        >
          选项二
        </component>
      </el-radio-group>
    </el-form-item>
  
          </template>
        </el-table-column>
      
      <el-table-column
        align="center"
        fixed="right"
        class-name="hidden-print"
        label="操作"
      >
        <template slot-scope="scope" >
          <ibps-toolbar
            :actions="manageButtons.dmsczbydyPoList"
            :hidden="readonly"
            :data="scope.row"
            :socpe="thatSocpe"
            position="manage"
            class="hidden-print" 
            @action-event="(action)=>operationEvent(action, scope.$index, 'dmsczbydyPoList')"
          />
        </template>
      </el-table-column>
          </el-table>
        </div>
      </div>
    
    </div>
      </el-form-item>
    
      <el-form-item
      label=""
      label-width="0"
      prop="dmsczbydd">
    <div class="dynamic-form-table">
  
      <div class="dynamic-form-table__inner panel panel-info">
        <div class="panel-heading ibps-clearfix">
          <div class="ibps-fl dynamic-form-table__label">代码生成子表一对多:V5</div>
      
          <div class="ibps-fr hidden-print">
            <el-button-group>
            
                <el-button
                :key="0"
                :hidden="readonly"
                type="primary"
                icon="ibps-icon-add"
                @click="handleActionEvent('add','dmsczbyddPoList','dmsczbyddPoList')"
              >
                添加
              </el-button>
                <el-button
                :key="1"
                :hidden="readonly"
                type="danger"
                icon="ibps-icon-remove"
                @click="handleActionEvent('remove','dmsczbyddPoList','dmsczbyddPoList')"
              >
                删除
              </el-button>
            </el-button-group>
          </div>
      
        </div>
        <div class="panel-body">
          <el-table
            ref="dmsczbyddPoList"
            :data="form.dmsczbyddPoList"
            border
            stripe
          >
            <el-table-column
              type="selection"
              width="50"
            />
            
        <el-table-column
          :key="0"
          prop="xingMing"
          
        >
          <template slot="header">
            姓名
            
          </template>
          <template slot-scope="props">
            
    <el-form-item
      prop="xingMing"
      
      label-width="0px"
      :class="{
        'dynamic-form-table-item__readonly':readonly
      }"
    >
  <el-input
      v-model="props.row.xingMing"
      placeholder="请输入"
      type="text"
      name="xingMing"
      :autosize="autosize"
      :rows="3"
      :readonly="readonly"
      clearable
      :style="{width:width}"
    /> 
    </el-form-item>
  
          </template>
        </el-table-column>
      
        <el-table-column
          :key="1"
          prop="createTime"
          
        >
          <template slot="header">
            创建时间
            
          </template>
          <template slot-scope="props">
            
    <el-form-item
      prop="createTime"
      
      label-width="0px"
      :class="{
        'dynamic-form-table-item__readonly':readonly
      }"
    >
  <el-date-picker
        v-model="props.row.createTime"
        type="date"
        value-format="yyyy-MM-dd HH:mm:ss"
        format="yyyy-MM-dd"
        placeholder="请选择"
        :style="{width:width}"
        :readonly="readonly"
        :clearable="false"
      />
    </el-form-item>
  
          </template>
        </el-table-column>
      
      <el-table-column
        align="center"
        fixed="right"
        class-name="hidden-print"
        label="操作"
      >
        <template slot-scope="scope">
          <ibps-toolbar
            :actions="manageButtons.dmsczbyddPoList"
            :hidden="readonly"
            :data="scope.row"
            :socpe="thatSocpe"
            position="manage"
            class="hidden-print"
            @action-event="(action)=>operationEvent(action, scope.$index, 'dmsczbyddPoList')"
          />
        </template>
      </el-table-column>
          </el-table>
        </div>
      </div>
    
    </div>
      </el-form-item>
    
      <el-row
        :gutter="0"
        justify="start"
        align="top"
        class="widget-col"
        type="flex"
      >
      <el-col :span="12">
        
      <el-form-item
      label="小数"
      
      prop="xiaoShu"><el-input
      v-model="form.xiaoShu"
      placeholder="请输入"
      type="number"
      name="xiaoShu"
      :autosize="autosize"
      :rows="3"
      :readonly="readonly"
      clearable
      @keypress="channelInputLimit"
      :style="{width:width}"
    /> 
      </el-form-item>
    
        </el-col>
        <el-col :span="12">
        
      <el-row
        :gutter="0"
        justify="start"
        align="top"
        class="widget-col"
        type="flex"
      >
      <el-col :span="12">
        
      <el-form-item
      label="单行文本"
      
      prop="danXingWenBen"><el-input
      v-model="form.danXingWenBen"
      placeholder="请输入"
      type="text"
      name="danXingWenBen"
      :autosize="autosize"
      :rows="3"
      :readonly="readonly"
      clearable
      :style="{width:width}"
    /> 
      </el-form-item>
    
        </el-col>
        <el-col :span="12">
        
      <el-form-item
      label="整数"
      
      prop="zhengShu"><el-input
      v-model="form.zhengShu"
      placeholder="请输入"
      type="number"
      name="zhengShu"
      :autosize="autosize"
      :rows="3"
      :readonly="readonly"
      clearable
      @keypress="channelInputLimit"
      :style="{width:width}"
    /> 
      </el-form-item>
    
        </el-col>
        
      </el-row>
      
        </el-col>
        
      </el-row>
      
      <el-form-item
      label="单选框"
      
      prop="danXuanKuang"><el-radio-group
          v-model="form.danXuanKuang"
          :disabled="readonly"
          
        > 
        
          <component
          :is="'el-radio'"
          :label="'1'"
          class="ibps-pt-5"
        >
          选项一
        </component>
          <component
          :is="'el-radio'"
          :label="'2'"
          class="ibps-pt-5"
        >
          选项二
        </component>
          <component
          :is="'el-radio'"
          :label="'3'"
          class="ibps-pt-5"
        >
          选项三
        </component>
      </el-radio-group>
      </el-form-item>
    
      <el-form-item
      label="多选框"
      
      prop="duoXuanKuang"><el-checkbox-group
          v-model="form.duoXuanKuang"
          :disabled="readonly"
          
        > 
        
          <component
          :is="'el-checkbox'"
          :label="'1'"
          class="ibps-pt-5"
        >
          选项一
        </component>
          <component
          :is="'el-checkbox'"
          :label="'2'"
          class="ibps-pt-5"
        >
          选项二
        </component>
          <component
          :is="'el-checkbox'"
          :label="'3'"
          class="ibps-pt-5"
        >
          选项三
        </component>
          <component
          :is="'el-checkbox'"
          :label="'4'"
          class="ibps-pt-5"
        >
          选项四
        </component>
      </el-checkbox-group>
      </el-form-item>
    
      <el-form-item
      label="日期时间"
      
      prop="riQiShiJian"><el-date-picker
        v-model="form.riQiShiJian"
        type="datetime"
        value-format="yyyy-MM-dd HH:mm:ss"
        format="yyyy-MM-dd HH:mm:ss"
        placeholder="请选择"
        :style="{width:width}"
        :readonly="readonly"
        :clearable="false"
      />
      </el-form-item>
    
      <el-form-item
      label="开关"
      
      prop="kaiGuan"><el-input
      v-model="form.kaiGuan"
      placeholder="请输入"
      type="number"
      name="kaiGuan"
      :autosize="autosize"
      :rows="3"
      :readonly="readonly"
      clearable
      @keypress="channelInputLimit"
      :style="{width:width}"
    /> 
      </el-form-item>
    
      <el-form-item
      label="滑块"
      
      prop="huaKuai"><div style="width:99%;">
        <el-slider
          v-model="form.huaKuai"
          :show-input="false"
          :show-tooltip="true"
          :max="100"
          :min="0"
          :step="1"
          :disabled="readonly"
          :style="{width:width}"
        />
      </div>
      </el-form-item>
    
      <el-form-item
      label="评分"
      
      prop="pingFen"><el-rate
        v-model="form.pingFen"
        :max="5"
        :allow-half="false"
        
        
        :disabled="readonly"
        class="ibps-pt-10"
      />
      </el-form-item>
    
      <el-form-item
      label="隐藏域"
      
      prop="yinCangYu"><el-input
      v-model="form.yinCangYu"
      placeholder="请输入"
      type="text"
      name="yinCangYu"
      :autosize="autosize"
      :rows="3"
      :readonly="readonly"
      clearable
      :style="{width:width}"
    /> 
      </el-form-item>
    
      <el-form-item
      label="描述"
      
      prop="miaoShu"><el-input
      v-model="form.miaoShu"
      placeholder="请输入"
      type="text"
      name="miaoShu"
      :autosize="autosize"
      :rows="3"
      :readonly="readonly"
      clearable
      :style="{width:width}"
    /> 
      </el-form-item>
    
      <el-form-item
      label="文本"
      
      prop="wenBen"><el-input
      v-model="form.wenBen"
      placeholder="请输入"
      type="textarea"
      name="wenBen"
      :autosize="autosize"
      :rows="3"
      :readonly="readonly"
      clearable
      :style="{width:width}"
    /> 
      </el-form-item>
    
      <el-form-item
      label="链接"
      
      prop="lianJie"><el-input
      v-model="form.lianJie"
      placeholder="请输入"
      type="text"
      name="lianJie"
      :autosize="autosize"
      :rows="3"
      :readonly="readonly"
      clearable
      :style="{width:width}"
    /> 
      </el-form-item>
    
      <div>
        <el-divider
          content-position="left"
        >分割线
        </el-divider>
        
      </div>
      
      <el-form-item
      label="分割线"
      
      prop="fenGeXian"><el-input
      v-model="form.fenGeXian"
      placeholder="请输入"
      type="text"
      name="fenGeXian"
      :autosize="autosize"
      :rows="3"
      :readonly="readonly"
      clearable
      :style="{width:width}"
    /> 
      </el-form-item>
    
      <el-form-item
      label="链接"
      
      prop="hyperlink_1psri1o">
      <ibps-link
        text="链接"
        link=""
        show-type="link"
        text-type="fixed"
        link-type="dynamic"
        text-javascript=""
        type="primary"
        :form-data="dynamicForm"
        preview-entrance
        icon=""
      />
    
      </el-form-item>
    
      <el-form-item
      label="警告"
      
      prop="jingGao">
        <el-switch
          v-model="form.jingGao"
          active-value="1"
          inactive-value="0"
          active-text=""
          inactive-text=""
          active-color="#90EE90"
          inactive-color="#C0CCDA"
          :disabled="readonly"
        />
      </el-form-item>
    
    <div class="ibps-pb-10">
      <el-alert
        title="警告"
        description="警告信息。。。。。"
        type="success"
        :closable="true"
        close-text=""
        :center="false"
        :show-icon="false"
        effect="light"
      />
    </div>
    
      <el-form-item
      label="文本"
      
      prop="label_18xoxc1"><span>
        
      </span>
        <div
          class="ibps-help-block"
          v-html="'文本信息'"
        />
      
      </el-form-item>
    
      <el-form-item
      label="数据字典"
      
      prop="shuJuZiDian">
      <ibps-dictionary
        v-model="form.shuJuZiDian"
        type-key="fieldControl"
        :multiple="false"
        select-mode="leaf"
        display-mode="path"
        separator="/"
        placeholder="请选择"
        :disabled="readonly"
        :readonly="readonly"
        :readonly-text="readonlyText?'text':'original'"
        :clearable="false"
        :style="{width:width}"
      />
    
      </el-form-item>
    
      <el-form-item
      label="自动编号"
      
      prop="ziDongBianHao"><ibps-auto-number
        v-model="form.ziDongBianHao"
        alias="lshcs"
        :init="true"
        placeholder=""
        :readonly="readonly"
        :readonly-text="readonlyText"
      />
      </el-form-item>
    
      <el-form-item
      label="上传附件"
      
      prop="shangChuanFuJian">
      <ibps-attachment
        v-model="form.shangChuanFuJian"
        placeholder="请选择"
        :download="true"
        :readonly="readonly"
        
        
        accept="*"
        :multiple="true"
        upload-type="attachment"
        store="json"
        media-type=""
        media=""
        :style="{width:width}"
      />
    
      </el-form-item>
    
      <el-form-item
      label="人员选择器"
      
      prop="xuanZeQi">
      <ibps-user-selector
        v-model="form.xuanZeQi"
        placeholder="请选择"
        type="user"
        
        :multiple="true"
        store="json"
        :disabled="readonly"
        :readonly-text="readonlyText?'text':null"
        :style="{width:width}"
      />
    
      </el-form-item>
    
      <el-form-item
      label="组织选择器"
      
      prop="zuZhiXuanZeQi">
      <ibps-user-selector
        v-model="form.zuZhiXuanZeQi"
        placeholder="请选择"
        type="org"
        
        :multiple="true"
        store="json"
        :disabled="readonly"
        :readonly-text="readonlyText?'text':null"
        :style="{width:width}"
      />
    
      </el-form-item>
    
      <el-form-item
      label="岗位选择器"
      
      prop="gangWeiXuanZeQi">
      <ibps-user-selector
        v-model="form.gangWeiXuanZeQi"
        placeholder="请选择"
        type="position"
        
        :multiple="true"
        store="json"
        :disabled="readonly"
        :readonly-text="readonlyText?'text':null"
        :style="{width:width}"
      />
    
      </el-form-item>
    
      <el-form-item
      label="角色选择器"
      
      prop="jiaoSeXuanZeQi">
      <ibps-user-selector
        v-model="form.jiaoSeXuanZeQi"
        placeholder="请选择"
        type="role"
        
        :multiple="true"
        store="json"
        :disabled="readonly"
        :readonly-text="readonlyText?'text':null"
        :style="{width:width}"
      />
    
      </el-form-item>
    
      <el-form-item
      label="关联数据"
      
      prop="guanLianShuJu"><el-input
      v-model="form.guanLianShuJu"
      placeholder="请输入"
      type="text"
      name="guanLianShuJu"
      :autosize="autosize"
      :rows="3"
      :readonly="readonly"
      clearable
      :style="{width:width}"
    /> 
      </el-form-item>
    
      <el-form-item
      label="地址"
      
      prop="diZhi">
    <div>
      <ibps-address
        v-model="form.diZhi"
        
        top="country"
        top-val="0"
        level="district"
        :disabled="readonly"
        :readonly-text="readonlyText?'text':null"
        placeholder="请选择"
        data-type="code"
        :style="{width:width}"
      />
      <span v-if="readonlyText">
        
      </span>
      <template v-else>
        <p />
        <el-input
          v-model="form.streetValuestreetValue"
          :disabled="readonly"
          :style="{width:width}"
          placeholder="请输入详细地址"
          type="textarea"
        />
      </template></div>
      </el-form-item>
    
      <el-form-item
      label="签名"
      
      prop="qianMing">
      <ibps-signature
        v-model="form.qianMing"
        placeholder="请在这里输入您的签名"
        
        :disabled="readonly"
        :style="{width:width}"
      />
    
      </el-form-item>
    
      <el-form-item
      label="图片"
      
      prop="tuPian">
      <ibps-image
        v-model="form.tuPian"
        width=""
        height=""
        limit=""
        accept=".jpg,.jpeg,.png,.gif,.bmp,.tif"
        media=""
        tip=""
        size=""
        upload-type="attachment"
        :disabled="readonly"
      />
    
      </el-form-item>
    
      <el-form-item
      label="当前用户"
      
      prop="dangQianYongHu">
      <ibps-user-selector
        v-model="form.dangQianYongHu"
        placeholder="请选择"
        type="user"
        
        :multiple="false"
        store="id"
        :disabled="true"
        :readonly-text="readonlyText?'text':null"
        :style="{width:width}"
      />
    
      </el-form-item>
    
      <el-form-item
      label="当前组织"
      
      prop="dangQianZuZhi">
      <ibps-user-selector
        v-model="form.dangQianZuZhi"
        placeholder="请选择"
        type="org"
        
        :multiple="false"
        store="id"
        :disabled="true"
        :readonly-text="readonlyText?'text':null"
        :style="{width:width}"
      />
    
      </el-form-item>
    
      <el-form-item
      label="当前日期"
      
      prop="dangQianRiQi"><el-date-picker
        v-model="form.dangQianRiQi"
        type="date"
        value-format="yyyy-MM-dd HH:mm:ss"
        format="yyyy-MM-dd"
        placeholder="请选择"
        :style="{width:width}"
        :readonly="true"
        :clearable="false"
      />
      </el-form-item>
    
      <el-form-item
      label="当前时间"
      
      prop="dangQianShiJian">
        <el-time-picker
          v-model="form.dangQianShiJian"
          value-format="HH:mm:ss"
          format="HH:mm:ss"
          placeholder="请选择"
          :style="{width:width}"
          :readonly="true"
          :clearable="false"
        />
      </el-form-item>
    
      </el-form>

      
      <div slot="footer" class="el-dialog--center">
        <ibps-toolbar :actions="toolbars" @action-event="handleDialogActionEvent" ref="toolbar" />
      </div>
      

    </el-dialog>
</template>
<script>
import { getNextIdByAlias } from '@/api/platform/system/identity'
import { validateInteger, validateNumberRange } from '@/utils/validate'

import ActionUtils from '@/utils/action'
import { save, get } from '@/api/skeleton/skeleton/dmsc'

import IbpsLink from '@/components/ibps-link'
import IbpsDictionary from '@/business/platform/cat/dictionary/select'
import IbpsAutoNumber from '@/business/platform/system/identity/auto-number'
import IbpsAttachment from '@/business/platform/file/attachment/selector'
import IbpsUserSelector from '@/business/platform/org/selector'
import IbpsAddressCascader from '@/components/ibps-address/cascader'
import IbpsSignature from '@/business/platform/form/formrender/dynamic-form/components/signature'
import IbpsImage from '@/business/platform/file/image'
  export default {
    props: {
      visible: {
        type: Boolean,
        default: true
      },
      readonly: {
        type: Boolean,
        default: false
      },
      id: String,
      title: String
    },
    
    components: {
      'ibps-link': IbpsLink,
'ibps-dictionary': IbpsDictionary,
'ibps-auto-number': IbpsAutoNumber,
'ibps-attachment': IbpsAttachment,
'ibps-user-selector': IbpsUserSelector,
'ibps-address': IbpsAddressCascader,
'ibps-signature': IbpsSignature,
'ibps-image': IbpsImage
    },
    data () {
      return {
        //
        formName: 'form',
        formLabelWidth: '120px',
        dialogVisible: this.visible,
        dialogLoading: false,
        defaultForm: {},
        defaulRules: {},
        //
        dynamicForm: this,
        form:{"duoXingWenBen":"","jiShuQi":"","xiaLaKuang":"","riQi":"","dmsczbydyPoList":[{"tenantId":"","ziBiaoRiQi1":"","ziBiaoXiaoShu1":"","ziBiaoDuoXuan1":["1"],"ip":"N","updateBy":"1"}],"dmsczbyddPoList":[{"xingMing":"","createTime":""}],"xiaoShu":"","danXingWenBen":"","zhengShu":"","id":"","danXuanKuang":"","duoXuanKuang":[],"riQiShiJian":"","kaiGuan":"","huaKuai":0,"pingFen":0,"yinCangYu":"","miaoShu":"","wenBen":"","lianJie":"","fenGeXian":"","jingGao":"N","label_18xoxc1":"","shuJuZiDian":"","ziDongBianHao":"","shangChuanFuJian":"","xuanZeQi":"","zuZhiXuanZeQi":"","gangWeiXuanZeQi":"","jiaoSeXuanZeQi":"","guanLianShuJu":"","diZhi":"","qianMing":"","tuPian":"","dangQianYongHu":"","dangQianZuZhi":"","dangQianRiQi":"","dangQianShiJian":""},
        inline:false,
        labelSuffix:'',
        labelWidth:'100px',
        labelPosition:'right',
        statusIcon:false,
        size:'',
        hideRequiredAsterisk:false,
        
        // readonly:false,
        readonlyText:true,
        multiple:false,
        autosize:'',
        width:'',
        toolbars:[
          {
            key: 'save', hidden: () => { return this.readonly },
            label: '提交',
            type: 'primary',
          },
          {
            key: 'cancel',
            label: '关闭'
          }
        ]
        ,formLayout:{tabs_1wvn8y5:'tab1'}
        ,rules:{zhengShu:[{"validator":validateInteger,"message":"只能是整数的数字"},{"validator":validateNumberRange,"min":5,"max":50}]}
        ,manageButtons:{"dmsczbydyPoList":[{"key":"remove","type":"danger","label":"删除","icon":"ibps-icon-remove"}],"dmsczbyddPoList":[{"key":"remove","type":"danger","label":"删除","icon":"ibps-icon-remove"}]}
        
        
      }
    },

    
    computed: {
      
      thatSocpe() {
        return this
      },
      
      
		  formId() {
		    return this.id
		  }, 
    },
    

    watch: {
      visible: {
        handler: function(val, oldVal) {
          this.dialogVisible = this.visible
        },
        immediate: true
      }
    },
    
    created(){
      this.defaultForm = JSON.parse(JSON.stringify(this.form))
      this.defaulRules = JSON.parse(JSON.stringify(this.rules))
    },
    
    methods: {
      
      
      operationEvent(button, index, name){
        console.info(button, index)
        // todo
        // 根据button.key判断不同的按钮，再通过index获取指定位置的数据（index为点击行在models的下标）
        switch (button.key) {
          case 'add':
            console.info('新增')
            break
          case 'edit':
            console.info('修改')
            break
          case 'remove':
            console.info('删除')
            this.$confirm('确定删除当前行?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.form[name].splice(index, 1)
              this.$message({
                message: '删除成功',
                type: 'success'
              })
            }).catch(() => {
              this.$message({
                type: 'info',
                message: '已取消删除'
              });          
            });
            break
          case 'import':
            console.info('导入')
            break
          case 'export':
            console.info('导出')
            break
          case 'custom':
            break
          default:
            break
        }
      },
      
      
  channelInputLimit(e) {
    if (e.key === 'e') {
      e.returnValue = false
      return false
    }
    return true
  },
  

      // 保存所有子表名称
      
        getSubTableNames() {
          return ['dmsczbydyPoList','dmsczbyddPoList']
        },
        
        // 保存所有checkbox字段名称
        
          getCheckboxFileds() {
            return ['dmsczbydyPoList.ziBiaoDuoXuan1','duoXuanKuang']
          },
          

          //加载表单数据时，转换checkbox字符串to数组
          convertCheckboxStrToArray() {
            let fieldNameArray = this.getCheckboxFileds()
            let subTableArray = this.getSubTableNames()
            // 主表checkbox
            fieldNameArray.forEach((fieldName) => {
              // console.log('this.form:fieldName='+fieldName)
              if(this.form[fieldName]){
                this.form[fieldName] = this.form[fieldName].split(',')
              }
            })
            // 子表checkbox
            subTableArray.forEach((tableName) => {
              // console.log('tableName:' + tableName)
              for (var p in this.form[tableName]) {
                // 遍历json对象的每个key/value对,p为key
                for (var k in this.form[tableName][p]) {
                  if ( fieldNameArray.includes(tableName + '.' + k) ) {
                    this.form[tableName][p][k] = this.form[tableName][p][k].split(',')
                  }
                }
              }
            })
            // console.log("this.form:" + JSON.stringify(this.form))
          },
          //提交表单数据时，转换checkbox数组to字符串
          convertCheckboxArrayToStr() {
            let formCopy = JSON.parse(JSON.stringify(this.form))
            let fieldNameArray = this.getCheckboxFileds()
            let subTableArray = this.getSubTableNames()
            // 主表checkbox
            fieldNameArray.forEach((fieldName) => {
              // console.log("fieldName=" + fieldName)
              if (formCopy[fieldName]) {
                formCopy[fieldName] = formCopy[fieldName].join(',')
              }
            })
            // 子表checkbox
            subTableArray.forEach((tableName) => {
              // console.log('tableName:' + tableName)
              for (var p in formCopy[tableName]) {
                // 遍历json对象的每个key/value对,p为key
                for (var k in formCopy[tableName][p]) {
                  if (
                    fieldNameArray.includes(tableName + '.' + k) && Array.isArray(formCopy[tableName][p][k])
                  ) {
                    formCopy[tableName][p][k] = formCopy[tableName][p][k].join(',')
                  }
                }
              }
            })
            // console.log('formCopy:' + JSON.stringify(formCopy))
            return formCopy
          },

      handleDialogActionEvent(button){
        // console.log('handleDialogActionEvent:button=' + JSON.stringify(button))
        switch (button.key) {
          case 'save':
            this.handleSave()
            break
          case 'cancel':
            this.closeDialog()
            break
          default:
            break
        }
      },

      // 表单验证
      formValidate() {
        if (this.readonly) return
        this.$nextTick(() => {
          this.$refs[this.formName].validate(() => {})
        })
      },

      // 保存数据
      handleSave() {
        this.$refs[this.formName].validate(valid => {
          if (valid) {
            this.saveData()
          } else {
            ActionUtils.saveErrorMessage()
          }
        })
      },

      // 提交保存数据
      saveData() {
        // console.log('saveData-from:' + JSON.stringify(this.form))
        let formCopy = this.convertCheckboxArrayToStr()
        // console.log('saveData-formCopy' + JSON.stringify(formCopy))
        save(formCopy).then(response => {
          this.$emit('callback', this)
          ActionUtils.saveSuccessAlert(response.message, (rtn) => {
            if (this.$utils.isEmpty(this.formId)) {
              this.$refs[this.formName].resetFields()
            }
            if (rtn) {
              this.closeDialog()
            }
          })
        }).catch((err) => {
          console.info(err)
        })
      },

      // 关闭当前窗口
      closeDialog() {
        this.$emit('close', false)
        this.$refs[this.formName].resetFields()
      },

      // 获取表单数据
      getFormData() {
        // console.log('getFormData formId:' + this.formId)
        if (this.readonly) {
          this.rules = {}
        } else {
          this.rules = this.defaulRules
        }
        if (this.$utils.isEmpty(this.formId)) {
          // 重置表单
          this.form = JSON.parse(JSON.stringify(this.defaultForm))
          // 初始化流水号
        this.initAuto('lshcs','ziDongBianHao')
        
          this.formValidate()
          return
        }
        this.dialogLoading = true
        get({
          id: this.formId
        }).then(response => {
          // console.log('response:' + JSON.stringify(response))
          this.form = response.data
          // console.log('response.data:' + JSON.stringify(response.data))
          this.convertCheckboxStrToArray()
          this.dialogLoading = false
        }).catch(() => {
          this.dialogLoading = false
        })
      }
      ,async initAuto(identity,name){
      let result = ''
      await getNextIdByAlias({
        alias: identity
      }).then(response => {
        result = response.data
        // console.log('initAuto :' + name + '=' + result)
      }).catch(() => {})
      this.form[name] = result
    }
      ,
    handleActionEvent(type,name,tableName){
      // console.info(this.$refs[tableName].selection)
      // todo
      // 修改、删除可根据this.$refs[tableName].selection获取选中行的数据
      switch (type) {
        case 'add':
          console.info('新增:')
          // 为表格增加数据
          if(!(this.form[name] && Array.isArray(this.form[name]))){
            this.form[name] = []
          }
             if(name === 'dmsczbydyPoList')this.form['dmsczbydyPoList'].push({tenantId:'',
ziBiaoRiQi1:'',
ziBiaoXiaoShu1:'',
ziBiaoDuoXuan1:[],
ip:'',
updateBy:''}); if(name === 'dmsczbyddPoList')this.form['dmsczbyddPoList'].push({xingMing:'',
createTime:''});
          break
        case 'edit':
          console.info('修改:')
          break
        case 'remove':
          console.info('删除:')
          // eslint-disable-next-line no-case-declarations
          const _temps = this.$refs[tableName].selection
          if (_temps && _temps.length > 0) {
            this.$confirm('确定删除?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.form[name] = this.form[name].filter(item => {
                return !_temps.includes(item)
              })
              this.$message({
                message: '批量删除成功',
                type: 'success'
              })
            }).catch(() => {
              this.$message({
                type: 'info',
                message: '已取消删除'
              });          
            });
          } else {
            this.$message({
              message: '当前没有选择数据，请先选择数据',
              type: 'warning'
            })
          }
          break
        case 'import':
          console.info('导入')
          break
        case 'export':
          console.info('导出')
          break
        case 'custom':
          // 新增自定义对话框按钮
          break
        default:
          break
      }
    }
  
    }
  }
</script>
<style lang="scss">
.dynamic-form {
  .el-input{
    width: 100%;
  }
  .el-select{
    width: 100%;
  }

  .el-collapse-item__header.is-active{
    border-bottom: 1px solid #EBEEF5;
    margin-bottom: 5px;
  }
  .form-header {
    border-bottom: 1px solid #2b34410d;
    margin-bottom: 5px;
    .title {
      font-size: 16px;
      font-weight: bold;
      color: #222;
      text-align: left;
      padding: 8px 10px 10px;
      margin: 0;
    }
    .desc {
      word-wrap: break-word;
      word-break: normal;
      text-indent: 0;
      line-height: 1.6;
      margin: 0 0 11px;
      padding: 3px 30px 8px;
    }
  }
  .dynamic-form-table-item__readonly{
    margin-bottom: 0;
  }

//===================border-form====================
  .ibps-border-form {
    border: 1px solid #cfd7e5;

    .el-form-item{
      border-top: 1px solid #cfd7e5;
    }

    .el-form-item__content:before {
      width: 1px;
      background: #cfd7e5;
      display: block;
      content: "";
      position: absolute;
      left: 0;
      top: 0;
      bottom:-20px;
    }

    .el-form-item__content .el-form-item__error {
      left: 5px
    }

    .el-form--label-top .el-form-item__content:before,
    .no-label-form-item .el-form-item__content:before {
      background: transparent
    }

    .el-row+.el-row {
      border-top: 1px solid #cfd7e5
    }

    .el-col+.el-col {
      border-left: 1px solid #cfd7e5
    }

    .el-col {
      overflow: hidden
    }

    .el-form-item__content {
      padding: 5px;
      padding-bottom: 0
    }

    .el-form-item__label {
      padding: 5px
    }

    .el-table{
      .el-form-item{
          border-top: 0;
      }
      .el-form-item__content:before {
        width: 0;
      }
      .el-form-item__content {
        padding: 0;
      }

    }

  }
  .machine_direction{
    display: flex;
    flex-direction: column;
  }
  .edui-editor{
    z-index: 1000!important;
  }

}

  .dynamic-form-table{
    .panel-heading{
      border-bottom:0;
      border-left: 1px solid #dde7ee;
      border-right: 1px solid #dde7ee;
    }
    .dynamic-form-table__inner{
      .panel-body{
        padding: 0;
      }
    }
    .dynamic-form-table__block{
      padding-bottom:10px;
      .panel-body{
        border: 1px solid #dde7ee;
      }
    }
    .el-rate{
      position: relative;
      display: inline-block;
    }
  }
  .is-error{
    .dynamic-form-table{
      border: 1px solid #F56C6C;
    }
  }
  
  .is-required:not(.is-no-asterisk){
    .dynamic-form-table__label:before {
      content: '*';
      color: #F56C6C;
      margin-right: 4px;
    }
  }
  

.el-dialog__header__todo {
  padding: 0;
  border-bottom: 0;
}
.el-dialog__body {
  padding: 0 2px 0 2px;
}
.el-dialog__headerbtn {
  z-index: 99999;
}
@media print {
  .el-dialog__headerbtn {
    display: none !important;
  }
  .hidden-print {
    padding: 0;
    margin: 0;
  }
}

</style>